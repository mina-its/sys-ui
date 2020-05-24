"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("../main");
let BrowseFile = /** @class */ (() => {
    let BrowseFile = class BrowseFile extends vue_property_decorator_1.Vue {
        fileBrowsed(e) {
            console.log('2-glob.fileGallery.fileBrowsed', main_1.glob);
            main_1.glob.fileBrowsed(e.target.files);
            // browseFile(fileBrowsed?: (files: any[]) => void) {
            //     glob.fileGallery.fileBrowsed = fileBrowsed;
            //     $('#file-browse').val('').click();
            // }
        }
    };
    BrowseFile = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'BrowseFile' })
    ], BrowseFile);
    return BrowseFile;
})();
exports.default = BrowseFile;
//# sourceMappingURL=BrowseFile.vue.js.map