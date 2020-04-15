"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
;
class {
}
"styles + ' border-0'" >
    v - ;
if ( = "viewType==2")
    class {
    }
"prop-file-box" >
    v - ;
for ( = "file in files" >
; ; )
"showMenu(file, $event)";
style = "cursor: pointer";
class {
}
"prop-file-item d-flex px-2 py-1 mb-2 border border-bottom" > class {
};
"flex-grow-1" > {};
{
    title(file);
}
/span><span;
class {
}
"property-file-size text-secondary text-nowrap mx-2" > {};
{
    size(file);
}
/span>
    < i;
"remove(file, $event)";
class {
}
"text-black-50 fa fa-times float-right p-1 fa-xs";
style = "cursor:pointer" > /i>
    < /div>
    < figure;
class {
}
"m-0";
v - ;
if ( = "prop.file && prop.file.preview && file._" >
    class {
    })
     = "figure-img img-fluid border";
src = "file._.uri";
"resetFileInfo($event, file)" /  >
    v - ;
if ( = "file._.dimensions" > {}) {
    file._.dimensions;
}
/figcaption>
    < /figure>
    < /div>
    < Function_vue_1.default;
v - ;
if ( = "showBrowseButton")
    title = "Browse file ...";
styles = "btn-secondary border";
"selectFile" > /Function>
    < /div>
    < div;
v - ;
class {
}
"'p-1 '+(viewType==3 ? 'd-inline-block': '')";
v - ;
for ( = "file in files" > {}; {}; )
    ;
class {
};
"text-secondary mx-2" > {};
{
    size(file);
}
/span></div >
    /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const types_2 = require("../types");
const main_1 = require("../main");
const uuid_1 = require("uuid");
const main = tslib_1.__importStar(require("../main"));
const Function_vue_1 = tslib_1.__importDefault(require("@/components/Function.vue"));
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
                main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.selectFromGallery);
                break;
        }
    }
    selectFromGallery(path, item) {
        let uri = `http://${main_1.joinUri(this.prop.file.drive.uri, path, item.name)}`;
        let file = {
            path,
            _: { uri },
            name: item.name,
            size: item.size,
            lastModified: item.lastModified
        };
        let val = this.doc[this.prop.name];
        if (Array.isArray(val)) {
            val = [...val]; // to prevent change it here
            val.push(file);
        }
        else
            val = file;
        main.dispatchFileAction(this, {
            prop: this.prop,
            val,
            item: this.doc,
            type: types_2.FileActionType.Select
        });
    }
    selectFile(e) {
        e.stopProgress();
        let val = this.getVal();
        if (this.prop.file && this.prop.file.drive && this.prop.file.drive.mode == types_1.DriveMode.Gallery) {
            let path = val && val.path ? val.path : this.prop.file.path;
            main.openFileGallery(this.prop.file.drive, val ? val.name : null, path, !!this.prop.file.path, this.selectFromGallery);
        }
        else {
            this.browseFile(val);
        }
    }
    getVal() {
        let val = this.doc[this.prop.name];
        if (this.prop.isList) {
            if (!val)
                val = [];
            else if (!Array.isArray(val))
                val = [val]; // in case of set property to multiple which already has data
        }
        return val;
    }
    browseFile(val) {
        main.browseFile((fileList) => {
            if (!fileList.length)
                return;
            let files = [];
            for (const file of fileList) {
                files.push({
                    name: uuid_1.v4() + "__" + file.name,
                    size: file.size,
                    lastModified: file.lastModified,
                    type: file.type,
                    _: {
                        rawData: file,
                        uri: URL.createObjectURL(file)
                    }
                });
            }
            if (this.prop.file && this.prop.file.sizeLimit) {
                if (files.find(item => item.size > this.prop.file.sizeLimit)) {
                    main.notify(`File size must be less than ${this.prop.file.sizeLimit}`, types_1.LogType.Error);
                    return;
                }
            }
            val = this.prop.isList ? val.concat(...files) : files[0];
            main.dispatchFileAction(this, {
                prop: this.prop,
                val,
                item: this.doc,
                type: types_2.FileActionType.Upload
            });
        });
    }
    remove(file, e) {
        let val = this.doc[this.prop.name];
        if (Array.isArray(val)) {
            val = val.filter(item => item.name != file.name);
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
        if (types_2.Constants.uniqueFilenameRegex.test(file.name))
            return file.name.replace(types_2.Constants.uniqueFilenameRegex, "");
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
    vue_property_decorator_1.Component({
        components: { Function: Function_vue_1.default }
    })
], PropFile);
exports.default = PropFile;
/script>
    < style;
lang = "scss" >
        .prop - value.prop - file;
{
    width: var ;
    (--wide - props - width);
    overflow: hidden;
    word - ;
    break ;
    break ;
    -all;
    margin - left;
    0;
    important;
    box - sizing;
    content - box;
        & -item;
    hover;
    {
        background - color;
        var ;
        (--light);
    }
    figure;
    {
        img;
        {
            max - height;
            350;
            px;
            object - fit;
            cover;
            max - width;
            100 % ;
        }
        figcaption;
        {
            margin - top;
            -45;
            px;
            margin - left;
            10;
            px;
            font - weight;
            500;
            text - shadow;
            1;
            px;
            1;
            px;
            1;
            px;
            666;
            color: ;
            FFF;
        }
    }
}
{
    prop - value.prop - file;
    {
        width: 100 % ;
    }
}
/style>;
//# sourceMappingURL=PropFile.vue.js.map