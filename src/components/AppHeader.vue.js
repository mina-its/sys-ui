"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("../main");
let AppHeader = class AppHeader extends vue_property_decorator_1.Vue {
    getAppUrl(app) {
        return main_1.prepareServerUrl(app.prefix);
    }
    get navColor() {
        let app = main_1.glob.config.apps.find(a => a.prefix == main_1.glob.config.prefix);
        if (app && app.navColor)
            return app.navColor;
        else
            return "";
    }
    clickLink(ev, item) {
        $("a.active").removeClass("active");
        $(`a[href='${item.ref}']`).addClass("active");
    }
    get currentRef() {
        return location.hostname;
    }
};
AppHeader = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'AppHeader' })
], AppHeader);
exports.default = AppHeader;
//# sourceMappingURL=AppHeader.vue.js.map