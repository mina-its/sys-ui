"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
let AppUserLoginMenu = class AppUserLoginMenu extends vue_property_decorator_1.Vue {
    get profilePhoto() {
        return main_1.glob.config.user.photoUrl || 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5bed565…/5f7abfa5-a174-45b5-a5a5-68a91a876506/128';
    }
    mounted() {
        $('.app-user-login .dropdown').on('show.bs.dropdown', function () {
            $(this).find('.dropdown-menu').first().stop(true, true).slideDown(100);
        });
        // Add slideUp animation to Bootstrap dropdown when collapsing.
        $('.app-user-login .dropdown').on('hide.bs.dropdown', function () {
            $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
        });
    }
};
AppUserLoginMenu = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'AppUserLoginMenu' })
], AppUserLoginMenu);
exports.default = AppUserLoginMenu;
//# sourceMappingURL=AppUserLoginMenu.vue.js.map