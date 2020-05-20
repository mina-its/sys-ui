"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const types_1 = require("../../../sys/src/types");
const types_2 = require("@/types");
const main = tslib_1.__importStar(require("../main"));
let FileGallery = class FileGallery extends vue_property_decorator_1.Vue {
    get glob() {
        return main_1.glob;
    }
    isSelected(item) {
        return main_1.glob.fileGallery.selected == item;
    }
    openRootMenu(e) {
        e.preventDefault();
        let items = [
            { ref: "upload", title: main_1.$t('upload') },
            { title: "-" },
            { ref: "refresh", title: main_1.$t('refresh') }
        ];
        main.showCmenu(null, items, e, (state, item) => {
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
        main.browseFile((files) => {
            main.ajax('/uploadToFileGallery?m=1', {
                drive: main_1.glob.fileGallery.drive._id,
                path: main_1.glob.fileGallery.path
            }, { files }, res => {
                main.refreshFileGallery();
                main.notify('upload done!', types_1.LogType.Debug);
            });
        });
    }
    removeFile(name) {
        main.question("Delete Confirm", `Are you sure you want to delete the file '${name}'`, [{ title: "YES", ref: types_1.YesNo.Yes }, { title: "NO", ref: types_1.YesNo.No }], null, (ref) => {
            if (!ref || ref == types_1.YesNo.No)
                return;
            main.ajax("/deleteFromFileGallery?m=1", {
                drive: main_1.glob.fileGallery.drive._id,
                pth: main_1.glob.fileGallery.path,
                name
            }, null, () => main.refreshFileGallery());
        });
    }
    openMenu(e, item) {
        if (item.type == types_1.DirFileType.Folder)
            return;
        let items = [
            { ref: "preview", title: main_1.$t('preview') },
            { ref: "download", title: main_1.$t('download') },
            // {ref: "rename", title: $t('rename')},
            { title: "-" },
            { ref: "remove", title: main_1.$t('remove') },
            { title: "-" },
            { ref: "refresh", title: main_1.$t('refresh') }
        ];
        main.showCmenu(item, items, e, (state, menu) => {
            switch (menu.ref) {
                case "remove":
                    this.removeFile(item.name);
                    break;
                case "preview":
                case "download":
                    window.open(main.joinUri(main_1.glob.fileGallery.uri, item.name), '_blank');
                    break;
                case "refresh":
                    main.refreshFileGallery();
                    break;
                case "rename":
                    item["editing"] = true;
                    console.log(item);
                    break;
            }
        });
        e.stopPropagation();
        e.preventDefault();
    }
    isImage(item) {
        let ext = item.name.split('.').pop().toLowerCase();
        return types_2.Constants.imageExtensions.includes(ext);
    }
    size(item) {
        return item.size ? "(" + main.toFriendlyFileSizeString(item.size) + ")" : "";
    }
    icon(item) {
        const root = '/@sys-ui/images/gallery/';
        if (item.type == types_1.DirFileType.Folder)
            return root + 'folder2.png';
        let ext = item.name.split('.').pop().toLowerCase();
        if (types_2.Constants.imageExtensions.includes(ext))
            return main.joinUri(main_1.glob.fileGallery.uri, item.name);
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
    browse(ref) {
        if (!main_1.glob.fileGallery.fixedPath) {
            main_1.glob.fileGallery.path = ref;
            main.refreshFileGallery();
        }
        else
            main.notify("Current directory Can not be changed!", types_1.LogType.Debug);
    }
    select(e, item) {
        console.log(1);
        main_1.glob.fileGallery.show = false;
        if (item)
            main_1.glob.fileGallery.selected = item;
        if (e.stopProgress)
            e.stopProgress();
        if (main_1.glob.fileGallery.selected && main_1.glob.fileGallery.selected.type == types_1.DirFileType.Folder) {
            main_1.glob.fileGallery.path = main.joinUri(main_1.glob.fileGallery.path, main_1.glob.fileGallery.selected.name);
            main.refreshFileGallery(null);
        }
        else {
            main_1.glob.fileGallery.show = false;
            main_1.glob.fileGallery.fileSelectCallback(main_1.glob.fileGallery.path, main_1.glob.fileGallery.selected);
        }
    }
    close(e) {
        main_1.glob.fileGallery.show = false;
        e.stopProgress();
    }
    focus(item) {
        main_1.glob.fileGallery.selected = item;
    }
    get breadcrumb() {
        if (main_1.glob.fileGallery.fixedPath)
            return [];
        let parts = main_1.glob.fileGallery.path.split("/").filter(el => el);
        let result = [];
        parts.forEach((part, i) => result.push({ title: part, ref: "" }));
        if (result.length > 0)
            result.unshift({ title: main.getText(main_1.glob.fileGallery.drive.name), ref: "" });
        result.pop();
        return result;
    }
    get files() {
        if (main_1.glob.fileGallery.fixedPath)
            main_1.glob.fileGallery.list = main_1.glob.fileGallery.list.filter(f => f.type == types_1.DirFileType.File);
        main_1.glob.fileGallery.list.sort((a, b) => b.type - a.type);
        main_1.glob.fileGallery.list.forEach(i => i["editing"] = false);
        return main_1.glob.fileGallery.list;
    }
    get current() {
        if (main_1.glob.fileGallery.fixedPath) {
            return main.getText(main_1.glob.fileGallery.drive.name) + ` (${main_1.glob.fileGallery.path})`;
        }
        else {
            let parts = main_1.glob.fileGallery.path.split("/").filter(el => el);
            if (parts.length == 0)
                return main.getText(main_1.glob.fileGallery.drive.name);
            return parts.pop();
        }
    }
};
FileGallery = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'FileGallery', components: {} })
], FileGallery);
exports.default = FileGallery;
//# sourceMappingURL=FileGallery.vue.js.map