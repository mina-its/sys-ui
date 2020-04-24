"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"app-user-login" >
    v - ;
if ( = "glob.config.user.loginUrl" >
    class {
    })
     = "dropdown-toggle my-2 my-sm-0 text-light";
href = "glob.config.user.loginUrl" > {};
{
    main_1.glob.config.user.loginTitle;
}
/a>
    < /div>
    < div;
v - ;
class {
}
"dropdown" >
    class {
    };
"avatar dropdown-toggle";
id = "dropdownProfileBrief";
data - toggle;
"dropdown";
aria - haspopup;
"true";
aria - expanded;
"false" >
    role;
"img";
style = "{'background-image':`url(${profilePhoto})`}" > /span>
    < /button>
    < div;
class {
}
"dropdown-menu dropdown-menu-right text-center profile-brief";
aria - labelledby;
"dropdownProfileBrief" >
    class {
    };
"m-4 mx-5";
src = "profilePhoto" /  >
    {};
{
    main_1.glob.config.user.title;
}
/h2>
    < div > {};
{
    main_1.glob.config.user.email;
}
/div>
    < a;
class {
}
"m-2 btn btn-outline-secondary";
href = "glob.config.user.profileUrl" > Profile < /a>
    < hr >
    class {
    };
"m-2 btn btn-secondary";
href = "/logout?f=1" > Sign;
out < /a>
    < hr >
    class {
    };
"m-2 text-secondary small";
href = "#" > Privacy;
Policy < /a>
    -
        class {
        };
"m-2 text-secondary small";
href = "#" > Terms;
of;
Service < /a>
    < /div>
    < /div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
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
    vue_property_decorator_1.Component
], AppUserLoginMenu);
exports.default = AppUserLoginMenu;
/script>
    < style;
scoped;
lang = "scss" >
        .profile - brief;
{
    width: 300;
    px;
}
profile - brief;
img;
{
    width: 120;
    px;
    border - radius;
    50 % ;
}
profile - brief.box;
span;
{
    width: 100;
    px;
    height: 100;
    px;
}
avatar;
{
    width: 38;
    px;
    height: 28;
    px;
    background - color;
    transparent;
    border: none;
    outline: none;
        & ;
    after;
    {
        display: none;
    }
}
avatar;
span;
{
    background - color;
    transparent;
    background - position;
    center;
    center;
    background - repeat;
    no - repeat;
    background - size;
    cover;
    border - radius;
    50 % ;
    display: flex;
    flex: 1;
    1;
    100 % ;
    width: 100 % ;
    height: 100 % ;
    cursor: pointer;
}
/style>;
//# sourceMappingURL=AppUserLoginMenu.vue.js.map