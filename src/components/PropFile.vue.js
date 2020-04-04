"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const types_2 = require("@/types");
const main_1 = require("@/main");
const uuid_1 = require("uuid");
const main = tslib_1.__importStar(require("@/main"));
let PropFile = class PropFile extends vue_property_decorator_1.Vue {
    showMenu(file, e) {
        if (this.prop.file && this.prop.file.drive) {
            let items = [
                { ref: "select", title: main_1.$t('select') },
                { ref: "download", title: main_1.$t('download') },
            ];
            main.showCmenu(file, items, e, this.selectMenu);
        }
    }
    selectMenu(file, item) {
        main.hideCmenu();
        if (!item)
            return;
        switch (item.ref) {
            case "download":
                window.open(file._.uri + `?m=${types_1.RequestMode.download}`, '_blank');
                break;
            case "select":
                let val = this.doc[this.prop.name];
                let path = val && val.path ? val.path : this.prop.file.path;
                main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.fileSelect);
                break;
        }
    }
    fileSelect(path, item) {
        let uri = `http://${main_1.joinUri(this.prop.file.drive.uri, path, item.name)}`;
        let file = { _id: uuid_1.v4(), path, _: { uri }, name: item.name, size: item.size };
        let val = this.doc[this.prop.name];
        if (Array.isArray(val))
            val.push(file);
        else
            val = file;
        main.dispatchFileAction(this, {
            prop: this.prop,
            val,
            item: this.doc,
            type: types_2.FileActionType.Select
        });
    }
    browseFile(e) {
        e.stopProgress();
        let item = this.doc;
        if (this.prop.file && this.prop.file.drive && this.prop.file.drive.mode == types_1.DriveMode.Gallery) {
            let val = item[this.prop.name];
            let path = val && val.path ? val.path : this.prop.file.path;
            main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.fileSelect);
        }
        else {
            main.browseFile((files) => {
                if (!files.length)
                    return;
                if (this.prop.file && this.prop.file.sizeLimit) {
                    if (files.find(file => file.size > this.prop.file.sizeLimit)) {
                        main.notify(`File size must be less than ${this.prop.file.sizeLimit}`, types_1.LogType.Error);
                        return;
                    }
                }
                main.dispatchFileAction(this, {
                    prop: this.prop,
                    files,
                    item: this.doc,
                    type: types_2.FileActionType.Upload
                });
            });
        }
    }
    remove(file, e) {
        let val = this.doc[this.prop.name];
        if (Array.isArray(val)) {
            val = val.filter(item => item._id != file._id);
            if (val.length == 0)
                val = null;
        }
        else
            val = null;
        main.dispatchFileAction(this, {
            prop: this.prop,
            item: this.doc,
            val,
            type: types_2.FileActionType.Delete
        });
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
    resetFileInfo(e, file) {
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
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropFile.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropFile.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropFile.prototype, "viewType", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropFile.prototype, "styles", void 0);
PropFile = tslib_1.__decorate([
    vue_property_decorator_1.Component
], PropFile);
exports.default = PropFile;
//# sourceMappingURL=PropFile.vue.js.map