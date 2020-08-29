"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
v - ;
if ( = "glob.config.appLocales && glob.config.appLocales.length>1")
    class {
    }
"app-locale-menu";
data - toggle;
"tooltip";
title = "Change Language" >
    v - ;
if ( = "glob.config.locale")
    class {
    }
"dropdown" >
    class {
    };
"nav-link py-0 px-0 text-light";
href = "#";
id = "navbarDropdownLocale";
role = "button";
data - toggle;
"dropdown";
aria - haspopup;
"true";
aria - expanded;
"false" >
    style;
"font-size: 16px";
class {
}
"fal fa-globe text-white px-1" > /i>{{glob.config.localeTitle}}
    < /a>
    < div;
class {
}
"dropdown-menu dropdown-menu-right";
aria - labelledby;
"navbarDropdownLocale" >
    v - ;
for ( = "item in glob.config.appLocales"; class {
} = "dropdown-item py-2 font-weight-bold text-center"; )
"changeLocale(item)";
href = "javascript:void(0);" > {};
{
    item.title;
}
/a>
    < /div>
    < /div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
let AppLocaleMenu = class AppLocaleMenu extends vue_property_decorator_1.Vue {
    changeLocale(locale) {
        // console.log(locale);
        location.href = main_1.setQs('e', locale.ref, true);
    }
};
AppLocaleMenu = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'AppLocaleMenu' })
], AppLocaleMenu);
exports.default = AppLocaleMenu;
/script>
    < style;
lang = "scss" >
        .app - locale - menu;
{
    dropdown - menu;
    {
        margin - top;
        1.05;
        rem;
    }
    dropdown - item;
    not(last - child);
    {
        border - bottom;
        1;
        px;
        solid;
        #e9ecef;
    }
}
/style>;
//# sourceMappingURL=AppLocaleMenu.vue.js.map