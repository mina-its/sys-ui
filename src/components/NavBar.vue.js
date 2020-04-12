"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const AppLocaleMenu_vue_1 = tslib_1.__importDefault(require("@/components/AppLocaleMenu.vue"));
let NavBar = class NavBar extends vue_property_decorator_1.Vue {
    get currentRef() {
        return location.hostname;
    }
};
NavBar = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: { AppLocaleMenu: AppLocaleMenu_vue_1.default } })
], NavBar);
exports.default = NavBar;
//# sourceMappingURL=NavBar.vue.js.map