<template>
    <div :class="styles + ' border-0'">
        <div v-if="viewType==2" class="prop-file-box">
            <div v-for="file in files">
                <div @click="showMenu(file, $event)" style="cursor: pointer"
                     class="prop-file-item d-flex px-2 py-1 mb-2 border border-bottom"><span class="flex-grow-1">{{title(file)}}</span><span
                        class="property-file-size text-secondary text-nowrap mx-2">{{size(file)}}</span>
                    <i @click="remove(file, $event)" class="text-black-50 fa fa-times float-right p-1 fa-xs"
                       style="cursor:pointer"></i>
                </div>
                <figure class="m-0" v-if="prop.file && prop.file.preview && file._">
                    <img class="figure-img img-fluid border" :src="file._.uri"
                         @load="resetFileInfo($event, file)"/>
                    <figcaption v-if="file._.dimensions">{{file._.dimensions}}</figcaption>
                </figure>
            </div>
            <Function v-if="showBrowseButton" title="Browse file ..." styles="btn-secondary border"
                      @exec="browseFile"></Function>
        </div>
        <div v-else :class="'p-1 '+(viewType==3 ? 'd-inline-block': '')" v-for="file in files">{{title(file)}}<span
                class="text-secondary mx-2">{{size(file)}}</span></div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {DirFile, DriveMode, LogType, Property, RequestMode, IData, mFile} from "../../../sys/src/types";
    import {FileAction, FileActionType, FunctionExecEventArg, MenuItem} from '@/types';
    import {$t, glob, joinUri} from '@/main';
    import {v4 as uuidv4} from 'uuid';
    import * as main from '@/main';

    @Component
    export default class PropFile extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: IData;
        @Prop() private viewType: any;
        @Prop() private styles: string;

        showMenu(file, e) {
            if (this.prop.file && this.prop.file.drive) {
                let items: MenuItem[] = [
                    {ref: "select", title: $t('select')},
                    {ref: "download", title: $t('download')},
                ];
                main.showCmenu(file, items, e, this.selectMenu);
            }
        }

        selectMenu(file: mFile, item) {
            main.hideCmenu();
            if (!item) return;
            switch (item.ref) {
                case "download":
                    window.open(file._.uri + `?m=${RequestMode.download}`, '_blank');
                    break;
                case "select":
                    let val = this.doc[this.prop.name] as mFile;
                    let path = val && val.path ? val.path : this.prop.file.path;
                    main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.fileSelect);
                    break;
            }
        }

        fileSelect(path: string, item: DirFile) {
            let uri = `http://${joinUri(this.prop.file.drive.uri, path, item.name)}`;
            let file = {_id: uuidv4(), path, _: {uri}, name: item.name, size: item.size} as mFile;

            let val = this.doc[this.prop.name];
            if (Array.isArray(val))
                val.push(file);
            else
                val = file;

            main.dispatchFileAction(this, {
                prop: this.prop,
                val,
                item: this.doc,
                type: FileActionType.Select
            } as FileAction);
        }

        browseFile(e: FunctionExecEventArg) {
            e.stopProgress();
            let item = this.doc;
            if (this.prop.file && this.prop.file.drive && this.prop.file.drive.mode == DriveMode.Gallery) {
                let val = item[this.prop.name] as mFile;
                let path = val && val.path ? val.path : this.prop.file.path;
                main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.fileSelect);
            } else {
                main.browseFile((files) => {
                    if (!files.length) return;

                    if (this.prop.file && this.prop.file.sizeLimit) {
                        if (files.find(file => file.size > this.prop.file.sizeLimit)) {
                            main.notify(`File size must be less than ${this.prop.file.sizeLimit}`, LogType.Error);
                            return;
                        }
                    }

                    main.dispatchFileAction(this, {
                        prop: this.prop,
                        files,
                        item: this.doc,
                        type: FileActionType.Upload
                    } as FileAction);
                });
            }
        }

        remove(file: mFile, e) {
            let val = this.doc[this.prop.name];
            if (Array.isArray(val)) {
                val = val.filter(item => item._id != file._id);
                if (val.length == 0)
                    val = null;
            } else
                val = null;

            main.dispatchFileAction(this, {
                prop: this.prop,
                item: this.doc,
                val,
                type: FileActionType.Delete
            } as FileAction);
            e.stopPropagation();
        }

        size(file) {
            if (file.size)
                return "(" + main.toFriendlyFileSizeString(file.size) + ")";
            else
                return null;
        }

        title(file) {
            return file.path ? main.joinUri(file.path, file.name) : file.name;
        }

        resetFileInfo(e, file: mFile) {
            if (e.path && e.path[0] && e.path[0].naturalWidth) {
                file._.dimensions = e.path[0].naturalWidth + " x " + e.path[0].naturalHeight;
                this.$forceUpdate();
            }
        }

        get showBrowseButton() {
            return !this.files || this.prop.isList || !this.prop.file;
        }

        get files() {
            let val = this.doc[this.prop.name];
            if (!val || val.length == 0)
                return null;

            if (!Array.isArray(val))
                val = [val];

            return val;
        }

        get allowUpload() {
            return !this.files || this.prop.isList;
        }
    }
</script>

<style lang="scss">
    .prop-value.prop-file {
        width: var(--wide-props-width);
        overflow: hidden;
        word-break: break-all;
        margin-left: 0 !important;
        box-sizing: content-box;

        &-item:hover {
            background-color: var(--light);
        }

        figure {
            img {
                max-height: 350px;
                object-fit: cover;
                max-width: 100%;
            }

            figcaption {
                position: absolute;
                z-index: 1000;
                margin-top: -40px;
                margin-left: 10px;
                background-color: #92AD40;
                padding: 0 10px;
                color: #FFF;
            }
        }
    }

    @media (max-width: 576px) {
        .prop-value.prop-file {
            width: 100%;
        }
    }
</style>
