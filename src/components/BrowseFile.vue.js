"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
id;
"file-browse";
type = "file";
class {
}
"d-none";
"fileBrowsed";
style = "width: 0;height: 0;";
multiple = "true" >
    /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
let BrowseFile = class BrowseFile extends vue_property_decorator_1.Vue {
    fileBrowsed(e) {
        main_1.glob.fileGallery.fileBrowsed(e.target.files);
        // browseFile(fileBrowsed?: (files: any[]) => void) {
        //     glob.fileGallery.fileBrowsed = fileBrowsed;
        //     $('#file-browse').val('').click();
        // }
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], BrowseFile.prototype, "prop", void 0);
BrowseFile = tslib_1.__decorate([
    vue_property_decorator_1.Component
], BrowseFile);
exports.default = BrowseFile;
/script>
    < style;
lang = "scss" >
    /style>;
//# sourceMappingURL=BrowseFile.vue.js.map