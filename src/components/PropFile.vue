<template>
    <div :class="styles + ' border-0'">
        <div v-if="viewType==2" class="prop-file-box">
            <div @click="showMenu(file, $event)" v-for="file in files">
                <figure v-if="prop.file && prop.file.preview && file._">
                    <img class="figure-img img-fluid border" :src="file._.uri"
                         @load="resetFileInfo($event, file)"/>
                    <figcaption v-if="file._.dimensions">{{file._.dimensions}}</figcaption>
                </figure>
                <div v-else style="cursor: pointer"
                     class="prop-file-item d-flex px-2 py-1 mb-2 border border-bottom"><span class="flex-grow-1">{{title(file)}}</span><span
                        class="property-file-size text-secondary text-nowrap mx-2">({{size(file)}})</span>
                    <i @click="remove(file, $event)" class="text-black-50 fa fa-times float-right p-1 fa-xs"
                       style="cursor:pointer"></i>
                </div>
            </div>
            <Function v-if="showBrowseButton" title="Browse file ..." styles="btn-light py-1 px-2 border"
                      @exec="selectFile"></Function>
        </div>
        <div v-else v-for="file in files" @click="showMenu(file, $event)">
            <img v-if="prop.file && prop.file.preview && file._" class="thumbnail" :src="file._.uri"/>
            <div v-else :class="{'p-1': true, 'd-inline-block': viewType==3}">
                <div>{{title(file)}}<span class="text-secondary mx-2">{{size(file)}}</span></div>
            </div>
        </div>
        <a class="w-100 h-100 text-center prop-file-empty fal fa-file-upload cursor-pointer" v-if="viewType!=2 && (!files || !files.length)" @click="selectFile(null)"></a>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {DirFile, IData, LogType, mFile, Property, RequestMode, ObjectViewType} from "../../../sys/src/types";
    import {Constants, ItemChangeEventArg, FunctionExecEventArg, ID, MenuItem, ChangeType} from '../types';
    import main, {$t, browseFile, glob, hideCmenu, joinUri, notify, openFileGallery, showCmenu, toFriendlyFileSizeString} from '../main';

    @Component({name: 'PropFile', components: {}})
    export default class PropFile extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: IData;
        @Prop() private viewType: ObjectViewType;
        @Prop() private styles: string;
        @Prop() private readOnly: boolean;

        mounted() {
            // if (!this.prop.file) notify(`Drive must be configured for property '${this.prop.title}'`, LogType.Error);
        }

        showMenu(file, e) {
            if (this.prop.file && this.prop.file.drive) {
                let items: MenuItem[] = [
                    {title: this.title(file) + " (" + this.size(file) + ")"},
                    {ref: "preview", title: $t('preview')},
                    {title: '-'},
                    {ref: "select", title: $t('select')},
                    {ref: "download", title: $t('download')},
                    {title: '-'},
                    {ref: "remove", title: $t('remove')}
                ];
                showCmenu(file, items, e, this.selectMenu);
            }
        }

        selectMenu(file: mFile, item) {
            hideCmenu();
            if (!item) return;
            switch (item.ref) {
                case "preview":
                    glob.imagePreview.url = file._.uri;
                    glob.imagePreview.show = true;
                    break;

                case "download":
                    window.open(file._.uri + `?m=${RequestMode.download}`, '_blank');
                    break;

                case "remove":
                    this.changed(ChangeType.DeleteFile, null);
                    break;

                case "select":
                    this.selectFile();
                    break;
            }
        }

        selectFromGallery(path: string, item: DirFile) {
            let uri = `http://${joinUri(this.prop._.fileUri, path, item.name)}`;
            let file = {
                path,
                _: {uri},
                name: item.name,
                size: item.size,
                lastModified: item.lastModified
            } as mFile;

            let val = this.doc[this.prop.name];
            if (Array.isArray(val)) {
                val = [...val]; // to prevent change it here
                val.push(file);
            } else
                val = file;

            this.changed(ChangeType.SelectFile, val);
        }

        selectFile(e?: FunctionExecEventArg) {
            if (e) e.stopProgress();
            let val = this.getVal();
            if (!this.prop.file || !this.prop.file.drive) {
                this.openFileBrowse(val);
                return;
            }

            if (this.prop.file.gallery) {
                let path = val && val.path ? val.path : this.prop.file.path;
                openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.selectFromGallery);
            } else {
                this.openFileBrowse(val);
            }
        }

        getVal() {
            let val = this.doc[this.prop.name];
            if (this.prop.isList) {
                if (!val) val = [];
                else if (!Array.isArray(val)) val = [val]; // in case of set property to multiple which already has data
            }
            return val;
        }

        openFileBrowse(val: mFile | mFile[]) {
            browseFile((files: mFile[]) => {
                if (!files || !files.length) return;

                for (let file of files) {
                    file.path = this.prop.file ? this.prop.file.path : "";
                    file.name = ID.generateByBrowser() + "__" + file.name;
                }

                if (this.prop.file && this.prop.file.sizeLimit) {
                    if (files.find(item => item.size > this.prop.file.sizeLimit)) {
                        notify(`File size must be less than ${this.prop.file.sizeLimit}`, LogType.Error);
                        return;
                    }
                }

                val = this.prop.isList ? (val as mFile[]).concat(...files) : files[0];
                this.changed(ChangeType.UploadFile, val);
            });
        }

        remove(file: mFile, e) {
            let val = this.doc[this.prop.name];
            if (Array.isArray(val)) {
                val = (val as mFile[]).filter(item => item.name != file.name);
                if (val.length == 0)
                    val = null;
            } else
                val = null;

            this.changed(ChangeType.DeleteFile);
            e.stopPropagation();
        }

        @Emit("changed")
        changed(type: ChangeType, val?: any): ItemChangeEventArg {
            return {
                prop: this.prop,
                item: this.doc,
                val,
                vue: this,
                type
            } as ItemChangeEventArg;
        }

        size(file) {
            if (file.size)
                return toFriendlyFileSizeString(file.size);
            else
                return null;
        }

        title(file) {
            if (this.prop.file && !this.prop.file.gallery)
                return file.name.replace(Constants.uniqueFilenameRegex, "");

            if (Constants.uniqueFilenameRegex.test(file.name))
                return file.name.replace(Constants.uniqueFilenameRegex, "");

            return file.path ? joinUri(file.path, file.name) : file.name;
        }

        resetFileInfo(e, file: mFile) {
            if (e.path && e.path[0] && e.path[0].naturalWidth) {
                file._.dimensions = e.path[0].naturalWidth + " x " + e.path[0].naturalHeight;
                this.$forceUpdate();
            }
        }

        get showBrowseButton() {
            return (!this.files || this.prop.isList || !this.prop.file) && !this.readOnly;
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
    .prop-file {
        .thumbnail {
            height: 32px;
            margin: -0.3rem;
        }
    }

    .prop-file-empty {
        color: transparent !important;

        &:hover {
            color: black !important;
        }
    }

    .prop-value.prop-file {
        overflow: hidden;
        word-break: break-all;
        padding: 0;
        margin-left: 0 !important;
        box-sizing: border-box;
        width: var(--wide-props-width);

        .wide-prop {
        }

        &-item:hover {
            background-color: var(--light);
        }

        figure {
            img {
                max-height: 350px;
                object-fit: cover;
                max-width: 320px;
            }

            figcaption {
                position: absolute;
                margin-top: -35px;
                margin-left: 10px;
                font-weight: 500;
                text-shadow: 1px 1px 1px #666;
                color: #fff;
            }
        }
    }

    @media (max-width: 768px) {
        .prop-value.prop-file {
            width: 100%;
        }
    }
</style>
