<template>
    <div v-if="glob && glob.fileGallery.show" id="file-gallery">
        <transition name="fade">
            <div class="modal-mask">
                <div class="modal-wrapper align-middle">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content" @contextmenu="openRootMenu">
                            <div class="modal-header" v-if="glob.fileGallery.drive">
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                                        <li v-for="item in breadcrumb" class="breadcrumb-item">
                                            <a @click="browse(item.uri)" href="#">{{item.title}}</a>
                                            <i class="fa fa-chevron-right my-1 ml-2"></i>
                                        </li>
                                        <li class="breadcrumb-item active" aria-current="page">{{current}}</li>
                                    </ol>
                                </nav>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" @click="glob.fileGallery.show = false">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="d-flex flex-wrap px-4">
                                    <transition name="fade">
                                        <div v-if="glob.fileGallery.loading" class="file-gallery-waiting p-5"><i
                                                class="fa text-secondary fa-spin fa-refresh fa-lg"></i><span
                                                class="p-2">loading ...</span></div>
                                    </transition>
                                    <div v-for="item of files" @dblclick="select({}, item)"
                                         class="file-gallery-item m-1 p-1" tabindex="1" @focus="focus(item)"
                                         @contextmenu="openMenu($event, item)" v-focus="isSelected(item)">
                                        <div class="gallery-item-file d-flex align-items-end justify-content-center">
                                            <img :class="{'file-gallery-image-src': isImage(item)}" :src="icon(item)"/>
                                        </div>
                                        <label class="text-center mt-1 w-100 file-gallery-label">{{item.name}}<span
                                                class="file-gallery-size">{{size(item)}}</span></label>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="d-flex w-100">
                                    <Function v-if="glob.fileGallery.selectable" styles="m-2 btn-primary" @exec="select"
                                              :title="$t('select')"></Function>
                                    <Function styles="m-2 btn-secondary" @exec="close" :title="$t('close')"></Function>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob, $t} from '@/main';
    import {DirFile, LogType, DirFileType, YesNo, Pair, AjaxConfig, mFile} from '../../../sys/src/types';
    import {MenuItem, FunctionExecEventArg, Constants} from '@/types';
    import * as main from '../main';

    @Component({name: 'FileGallery', components: {}})
    export default class FileGallery extends Vue {
        isSelected(item: DirFile) {
            return glob.fileGallery.selected == item;
        }

        openRootMenu(e) {
            e.preventDefault();

            let items: MenuItem[] = [
                {ref: "upload", title: $t('upload')},
                {title: "-"},
                {ref: "refresh", title: $t('refresh')}
            ];
            main.showCmenu(null, items, e, (state, item: MenuItem) => {
                switch (item.ref) {
                    case "upload":
                        this.upload();
                        break;

                    case "refresh":
                        main.refreshFileGallery();
                        break;
                }
            });
        }

        upload() {
            main.browseFile((files: mFile[]) => {
                main.call('uploadToFileGallery', {
                        drive: glob.fileGallery.drive,
                        path: glob.fileGallery.path,
                        files
                    }, res => {
                        main.refreshFileGallery();
                        main.notify('upload done!', LogType.Debug);
                    }
                )
                ;
            });
        }

        removeFile(name: string) {
            main.question("Delete Confirm", `Are you sure you want to delete the file '${name}'`,
                [{title: "YES", ref: YesNo.Yes}, {title: "NO", ref: YesNo.No}], null, (ref: any) => {
                    if (!ref || ref == YesNo.No) return;
                    main.ajax("/deleteFromFileGallery?m=1", {
                        drive: glob.fileGallery.drive,
                        pth: glob.fileGallery.path,
                        name
                    }, null, () => main.refreshFileGallery());
                });
        }

        openMenu(e, item: DirFile) {
            if (item.type == DirFileType.Folder) return;

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
                            window.open(main.uriJoin(glob.fileGallery.uri, item.name), '_blank');
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
            return item.size ? "(" + main.toFriendlyFileSizeString(item.size) + ")" : "";
        }

        icon(item: DirFile) {
            const root = '/public/images/gallery/';
            if (item.type == DirFileType.Folder)
                return root + 'folder2.png';

            let ext = item.name.split('.').pop().toLowerCase();
            if (Constants.imageExtensions.includes(ext))
                return main.uriJoin(glob.fileGallery.uri, item.name);

            switch (ext) {
                case "doc":
                case "docx":
                    return root + 'doc.png';

                case "exe":
                    return root + 'exe.png';

                case "mp3":
                case "wav":
                    return root + 'music.png';

                case "pdf":
                    return root + 'pdf.png';

                case "avi":
                case "mp4":
                case "mov":
                    return root + 'play.png';

                case "zip":
                    return root + 'zip.png';

                case "xml":
                    return root + 'xml.png';

                default:
                    return root + 'file.png';
            }
        }

        browse(ref: string) {
            if (!glob.fileGallery.fixedPath) {
                glob.fileGallery.path = ref;
                main.refreshFileGallery();
            } else
                main.notify("Current directory Can not be changed!", LogType.Debug);
        }

        select(e: FunctionExecEventArg, item?: DirFile) {
            glob.fileGallery.show = false;
            if (item) glob.fileGallery.selected = item;
            if (e.stopProgress) e.stopProgress();

            if (glob.fileGallery.selected && glob.fileGallery.selected.type == DirFileType.Folder) {
                glob.fileGallery.path = main.uriJoin(glob.fileGallery.path, glob.fileGallery.selected.name);
                main.refreshFileGallery(null);
            } else {
                glob.fileGallery.show = false;
                glob.fileGallery.fileSelectCallback(glob.fileGallery.path, glob.fileGallery.selected);
            }
        }

        close(e: FunctionExecEventArg) {
            glob.fileGallery.show = false;
            e.stopProgress();
        }

        focus(item: DirFile) {
            glob.fileGallery.selected = item;
        }

        get breadcrumb() {
            if (glob.fileGallery.fixedPath) return [];
            let parts = glob.fileGallery.path.split("/").filter(el => el);
            let result: Pair[] = [];
            parts.forEach((part, i) => result.push({title: part, ref: ""}));

            if (result.length > 0)
                result.unshift({title: main.$t('drive'), ref: ""});
            result.pop();
            return result;
        }

        get files() {
            if (glob.fileGallery.fixedPath)
                glob.fileGallery.list = glob.fileGallery.list.filter(f => f.type == DirFileType.File);
            glob.fileGallery.list.sort((a, b) => b.type - a.type);
            glob.fileGallery.list.forEach(i => i["editing"] = false);
            return glob.fileGallery.list;
        }

        get current() {
            if (glob.fileGallery.fixedPath) {
                return main.$t('drive') + ` (${glob.fileGallery.path})`;
            } else {
                let parts = glob.fileGallery.path.split("/").filter(el => el);
                if (parts.length == 0) return main.$t('drive');
                return parts.pop();
            }
        }
    }
</script>

<style lang="scss">
    #file-gallery {

        .gallery-item-file {
            width: 100%;
            height: 128px;
        }

        .modal-body {
            height: 400px;
            max-height: 400px;
            overflow-y: auto;
        }

        .modal-footer {
            justify-content: flex-start;
        }

        .file-gallery- {
            &label {
                word-break: break-all;
                font-size: small;
            }

            &waiting {
                position: absolute;;
            }

            &item {
                width: 128px;

                &:hover {
                    background-color: #E5F3FF;
                }

                &:focus {
                    background-color: #DEF;
                    outline: 1px solid #CDF;
                    font-weight: 500;
                }
            }

            &image-src {
                box-shadow: 1px 1px 3px #999;
                max-width: 128px;
                max-height: 128px;
            }

            &size {
                color: gray;
                font-size: smaller;
                border-radius: 3px;
                padding: 0 3px;
                white-space: pre;
            }
        }
    }
</style>
