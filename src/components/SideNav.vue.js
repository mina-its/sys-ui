"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("../main");
let SideNav = class SideNav extends vue_property_decorator_1.Vue {
    get glob() {
        return main_1.glob;
    }
    mounted() {
        console.log(main_1.glob.config.navmenu);
    }
    getStyle(item) {
        let style = "text-nowrap nav-link";
        if (location.hostname == item.ref)
            style += " active";
        if (item.items)
            style += " has-child";
        return style;
    }
};
SideNav = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'SideNav' })
], SideNav);
exports.default = SideNav;
//# sourceMappingURL=SideNav.vue.js.map