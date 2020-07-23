<template>
    <div class="app-drive flex-column h-100 d-flex w-100">
        <!-- Toolbar -->
        <div class="d-flex align-items-center p-2 px-4 btn-toolbar toolbar">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb p-0 m-0 bg-transparent d-flex align-items-center">
                    <li class="mr-3">
                        <button title="Go Back" class="btn hover-opacity btn-link p-0"><i class="fal text-secondary fa-arrow-circle-left fa-2x"></i></button>
                    </li>
                    <li v-for="item in breadcrumb" class="breadcrumb-item">
                        <a :href="item.ref">{{item.title}}</a>
                        <i :class="{'fa my-1':1 ,'fa-chevron-right ml-2':ltr, 'fa-chevron-left mr-2':rtl}"></i>
                    </li>
                    <li class="breadcrumb-item d-flex align-items-center font-weight-bold active" aria-current="page">
                        <div>{{current}}</div>
                    </li>
                </ol>
            </nav>

            <i v-if="loading" class="mx-3 fad fa-sync fa-spin fa-lg fa-fw"></i>
        </div>

        <div class="content overflow-auto p-4 d-flex flex-wrap">
            <div v-for="item of files" @dblclick="select({}, item)" class="drive-item m-1 p-1" @focus="focus(item)"
                 @contextmenu="openMenu($event, item)" v-focus="isSelected(item)" tabindex="0">
                <div class="drive-item-file w-100 d-flex align-items-end justify-content-center">
                    <img v-if="isImage(item)" class="drive-image" :src="icon(item)"/>
                    <i v-else :class="icon(item)"></i>
                </div>
                <label class="text-center mt-1 w-100 file-gallery-label">{{item.name}}</label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {$t, ajax, call, notify, toFriendlyFileSizeString} from "../main";
    import {Pair, WebMethod, StatusCode, DirFileType, LogType, DirFile} from '../../../sys/src/types';
    import {Constants, FunctionExecEventArg, ID, MenuItem} from "../types";
    import * as main from "../main";

    @Component({name: 'AppDrive'})
    export default class AppDrive extends Vue {
        private uri: string = "";
        private path: string = "";
        private drive: DirFile = null;
        private list: any[] = [];
        private loading: boolean = true;
        private selected: DirFile = null;

        created() {
            call('getDrivesList', null, (err, res) => {
                this.list = res.data;
                this.loading = false;
            });
        }

        load() {
            call('getFileGallery', {path: this.path, drive: this.drive._id}, (err, res) => {
                this.loading = false;

                if (res.code != StatusCode.Ok) {
                    notify(res.message, LogType.Error);
                    return;
                }

                this.uri = res.data.uri;
                this.list = res.data.list;
            });
        }

        openMenu(e, item: DirFile) {
            if (item.type !== DirFileType.File) return;

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
                            // this.removeFile(item.name);
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
            )
            ;
            e.stopPropagation();
            e.preventDefault();
        }

        isImage(item: DirFile): boolean {
            let ext = item.name.split('.').pop().toLowerCase();
            return Constants.imageExtensions.includes(ext);
        }

        size(item: DirFile) {
            return item.size ? "(" + toFriendlyFileSizeString(item.size) + ")" : "";
        }

        focus(item: DirFile) {
            this.selected = item;
        }

        select(e: FunctionExecEventArg, item?: DirFile) {
            if (item) this.selected = item;
            if (e.stopProgress) e.stopProgress();

            if (!this.selected) return;

            switch (this.selected.type) {
                case DirFileType.Drive:
                    this.drive = this.selected;
                    this.path = "";
                    break;

                case DirFileType.Folder:
                    this.path = main.joinUri(this.path, this.selected.name);
                    break;

                default:
                    return;
            }

            this.load();
        }

        icon(item: DirFile) {
            if (item.type == DirFileType.Folder)
                return 'fa-folder-open text-primary fad fa-5x';

            else if (item.type == DirFileType.Drive)
                return 'fa-hdd fad text-primary mx-4 fa-5x';

            let ext = item.name.split('.').pop().toLowerCase();
            if (Constants.imageExtensions.includes(ext))
                return main.joinUri(this.uri, item.name);

            let css = "fad fa-3x ";
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
            let result: Pair[] = [{title: "Drives", ref: ""}];
            parts.forEach((part, i) => result.push({title: part, ref: ""}));
            if (result.length) {
                result.splice(1, 0, {title: this.drive.name, ref: ""});
            }
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