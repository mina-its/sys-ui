"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
let AppLocaleMenu = class AppLocaleMenu extends vue_property_decorator_1.Vue {
    changeLocale(locale) {
        location.href = main_1.setQs('e', locale.ref, true);
    }
};
AppLocaleMenu = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'AppLocaleMenu' })
], AppLocaleMenu);
exports.default = AppLocaleMenu;
//# sourceMappingURL=AppLocaleMenu.vue.js.map