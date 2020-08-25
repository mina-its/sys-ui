<template>
    <layout-default mainNoPadding="true" :title="title">
        <!--  Progress bar -->
        <template slot="toolbar-customs">
            <i v-show="loading" class="mx-3 fad fa-sync fa-spin fa-lg fa-fw"></i>

            <!--  Toggle View -->
            <button title="Toggle View" @click="toggleView" class="btn btn-link p-1 mx-2"><i :class="{'fal fa-lg':1,'fa-grip-horizontal':!gridView, 'fa-list':gridView}"></i></button>

            <!--  Refresh -->
            <button class="btn btn-link text-secondary px-2" @click="refresh"><i class="fas fa-sync"></i></button>
        </template>

        <!--  Main Content -->
        <template slot="main-content">
            <div v-if="gridView" class="app-drive content overflow-auto p-4 d-flex flex-wrap">
                <div v-for="item of files" @dblclick="select({}, item)" class="drive-item m-1 p-1" @focus="focus(item)"
                     @mouseup="openMenu($event, item)" v-focus="isSelected(item)" tabindex="0">
                    <div class="drive-item-file w-100 d-flex align-items-end justify-content-center">
                        <img v-if="isImage(item)" class="drive-image" :src="icon(item)"/>
                        <i v-else :class="icon(item)"></i>
                    </div>
                    <label class="text-center mt-1 w-100 file-gallery-label">{{item.name}}</label>
                </div>
            </div>
            <div v-else class="app-drive content bg-white overflow-auto d-flex flex-wrap">
                <table class="w-100 overflow-auto">
                    <thead>
                    <tr class="border-bottom">
                        <th class="py-2 px-4 w-100">Name</th>
                        <th class="py-2 text-right px-4">Size</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="border-bottom bg-light cursor-pointer" v-for="item of files" @dblclick="select({}, item)" @focus="focus(item)"
                        @mouseup="openMenu($event, item)" v-focus="isSelected(item)" tabindex="0">

                        <td class="no-select py-2 px-4 d-flex align-items-center">
                            <div style="width: 3rem;">
                                <i :class="icon(item)"></i>
                            </div>
                            <div class="">
                                {{item.name}}
                            </div>
                        </td>
                        <td class="py-2 px-4 text-right no-select">
                            {{size(item)}}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </layout-default>


    <!--    <div class="app-drive flex-column h-100 d-flex w-100" @contextmenu="onContextMenu">-->
    <!--        &lt;!&ndash; Toolbar &ndash;&gt;-->
    <!--        <div class="d-flex align-items-center p-2 px-4 btn-toolbar toolbar">-->
    <!--            <nav aria-label="breadcrumb">-->
    <!--                <ol class="breadcrumb p-0 m-0 bg-transparent d-flex align-items-center">-->
    <!--                    <li :class="{'ml-3':rtl,'mr-3':ltr}">-->
    <!--                        <button @click="back" title="Go Back" class="btn hover-opacity btn-link p-0"><i :class="{'fal text-secondary fa-2x':1,'fa-arrow-circle-left':ltr, 'fa-arrow-circle-right':rtl}"></i></button>-->
    <!--                    </li>-->
    <!--                    <li v-for="item in breadcrumb" class="breadcrumb-item">-->
    <!--                        <a @click="selectBreadcrumb(item)" href="javascript:void(0);">{{item.title}}</a>-->
    <!--                        <i :class="{'fa my-1':1 ,'fa-chevron-right ml-2':ltr, 'fa-chevron-left mr-2':rtl}"></i>-->
    <!--                    </li>-->
    <!--                    <li class="breadcrumb-item d-flex align-items-center font-weight-bold active" aria-current="page">-->
    <!--                        <div>{{current}}</div>-->
    <!--                    </li>-->
    <!--                </ol>-->
    <!--            </nav>-->

    <!--            <i v-show="loading" class="mx-3 fad fa-sync fa-spin fa-lg fa-fw"></i>-->

    <!--            <div class="mr-auto"></div>-->


    <!--            <div class="mx-3 h-100 border-left">&nbsp</div>-->


    <!--        </div>-->

    <!--    </div>-->
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {$t, call, glob, notify, toFriendlyFileSizeString} from "../main";
    import {Pair, YesNo, StatusCode, DirFileType, LogType, DirFile} from '../../../sys/src/types';
    import {Constants, FunctionExecEventArg, MenuItem} from "../types";
    import * as main from "../main";

    declare let $: any;

    @Component({name: 'AppDrive'})
    export default class AppDrive extends Vue {
        private uri: string = "";
        private path: string = "";
        private drive: DirFile = null;
        private drives: DirFile[] = [];
        private list: DirFile[] = [];
        private loading: boolean = false;
        private selected: DirFile = null;
        private gridView: boolean = false;
        private title: string = "Drives";

        created() {
            let $this = this;
            $(window).on('popstate', (event) => {
                $this.browsePath(location.pathname);
            });

            this.gridView = localStorage.getItem('app-drive-grid-view') == "1";
            call('getDrivesList', null, (err, res) => {
                this.drives = res.data;
                this.loading = false;
                this.browsePath(location.pathname);
            });
        }

        browsePath(path: string) {
            let parts = path.split('/').slice(2);

            if (parts.length < 2) {
                document.title = `App Drive`;
                history.pushState(null, null, "/app-drive");
                this.list = this.drives;
                this.drive = null
                this.path = null;
                this.title = "Drives";
            } else {
                this.drive = this.drives.find(l => l.name == parts[0] + "/" + parts[1]);
                if (this.drive) {
                    this.path = glob.form.breadcrumbLast = parts.slice(2).join("/");
                    history.pushState(null, null, path);
                    this.load();
                }
            }
        }

        toggleView() {
            this.gridView = !this.gridView;
            localStorage.setItem('app-drive-grid-view', this.gridView ? "1" : "0");
        }

        refresh() {
            this.browsePath(location.pathname);
        }

        load() {
            call('getFileGallery', {path: this.path, driveId: this.drive._id}, (err, res) => {
                this.loading = false;

                if (res.code != StatusCode.Ok) {
                    notify(res.message, LogType.Error);
                    return;
                }

                $(":focus").blur();
                this.uri = res.data.uri;
                this.list = res.data.list;

                document.title = `App Drive: ${main.joinUri(this.drive.name, this.path)}`;
            });
        }

        refreshBreadCrumb(){
            //glob.form.breadcrumb;
            this.title = this.path;
        }

        onContextMenu(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        openMenu(e, item: DirFile) {
            if (e.which != 3 || item.type !== DirFileType.File) return;

            let items: MenuItem[] = [
                {ref: "preview", title: $t('preview')},
                {ref: "download", title: $t('download')},
                // {ref: "rename", title: $t('rename')},
                {title: "-"},
                {ref: "remove", title: $t('remove')},
                {title: "-"},
                {ref: "refresh", title: $t('refresh')}
            ];
            main.showCmenu(item, items, e, (state, menu: MenuItem) => {
                    switch (menu.ref) {
                        case "remove":
                            this.removeFile(item.name);
                            break;
                        case "preview":
                        case "download":
                            window.open(main.joinUri(this.uri, item.name), '_blank');
                            break;

                        case "refresh":
                            main.refreshFileGallery();
                            break;

                        case "rename":
                            item["editing"] = true;
                            console.log(item);
                            break;
                    }
                }
            );
            e.stopPropagation();
            e.preventDefault();
        }

        removeFile(name: string) {
            main.question("Confirm delete file", `Are you sure you want to delete the file '${name}'`,
                [
                    {title: "Cancel", ref: "no", _cs: "btn btn-light ml-2"},
                    {title: "Delete file", ref: "yes", _cs: "btn btn-danger ml-2"}], null, (ref: any) => {

                    if (!ref || ref != "yes") return;
                    main.ajax("/deleteFromFileGallery?m=1", {
                        drive: this.drive._id,
                        pth: this.path,
                        name
                    }, null, () => this.refresh());
                });
        }

        isImage(item: DirFile): boolean {
            let ext = item.name.split('.').pop().toLowerCase();
            return Constants.imageExtensions.includes(ext);
        }

        size(item: DirFile) {
            return item.size ? toFriendlyFileSizeString(item.size) : "";
        }

        focus(item: DirFile) {
            this.selected = item;
        }

        selectBreadcrumb(item: Pair) {
            this.browsePath(item.ref);
        }

        select(e: FunctionExecEventArg, item?: DirFile) {
            if (item) this.selected = item;
            if (e.stopProgress) e.stopProgress();
            if (!this.selected) return;

            switch (this.selected.type) {
                case DirFileType.Drive:
                    this.drive = this.selected;

                    history.pushState(null, null, "/app-drive/" + this.drive.name);
                    this.path = "";
                    break;

                case DirFileType.Folder:
                    this.path = main.joinUri(this.path, this.selected.name);
                    let url = main.joinUri("app-drive", this.drive.name, this.path);
                    history.pushState(null, null, "/" + url);
                    break;

                default:
                    return;
            }

            this.load();
        }

        icon(item: DirFile) {
            if (item.type == DirFileType.Folder)
                return 'fa-folder-open text-primary fad ' + (this.gridView ? 'fa-5x' : 'mx-2 fa-lg');

            else if (item.type == DirFileType.Drive)
                return 'fa-hdd fad text-primary ' + (this.gridView ? 'mx-4 fa-5x' : 'mx-2 fa-lg');

            let ext = item.name.split('.').pop().toLowerCase();
            if (this.gridView && Constants.imageExtensions.includes(ext))
                return main.joinUri(this.uri, this.path, item.name);

            let css = "fal " + (this.gridView ? 'fa-2x ' : 'fa-lg text-black-50 mx-2 ');
            switch (ext) {
                case "doc":
                case "docx":
                    return css + 'fa-file-word';

                case "exe":
                    return css + 'fa-file-medical-alt';

                case "mp3":
                case "wav":
                    return css + 'fa-file-audio';

                case "pdf":
                    return css + 'fa-file-pdf';

                case "xsl":
                case "xslx":
                    return css + 'fa-file-spreadsheet';

                case "avi":
                case "mp4":
                case "mov":
                    return css + 'fa-file-video';

                case "jpg":
                case "png":
                case "ico":
                    return css + 'fa-file-image';

                case "tar":
                case "zip":
                    return css + 'fa-file-archive';

                case "txt":
                    return css + 'fa-file-alt';

                case "csv":
                    return css + 'fa-file-csv';

                case "xml":
                    return css + 'fa-file-code';

                default:
                    return css + 'fa-file';
            }
        }

        isSelected(item: DirFile) {
            return this.selected == item;
        }

        get current() {
            if (!this.path) return this.drive ? this.drive.name : "Drives";
            let parts = this.path.split("/").filter(el => el);
            if (parts.length == 0) return $t('drive');
            return parts.pop();
        }

        get breadcrumb() {
            if (!this.drive) return [];

            let parts = this.path.split("/").filter(el => el);
            let result: Pair[] = [{title: "Drives", ref: "/app-drive"}];
            parts.forEach((part, i) => result.push({title: part, ref: `/app-drive/${this.drive.name}/` + parts.slice(0, i + 1).join("/")}));

            if (result.length)
                result.splice(1, 0, {title: this.drive.name, ref: `/app-drive/${this.drive.name}`});

            result.pop();
            return result;
        }

        get files() {
            this.list.sort((a, b) => b.type - a.type);
            this.list.forEach(i => i["editing"] = false);
            return this.list;
        }
    }
</script>

<style lang="scss">
    .app-drive {
        .drive-item-file {
            height: 8rem;
        }

        .drive-item {
            width: 10rem;
        }

        .drive-image {
            box-shadow: 1px 1px 3px #999;
            padding: .5rem;
            max-width: 10rem;
            max-height: 8rem;
        }

    }
</style>