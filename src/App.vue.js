"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"d-flex h-100 flex-column" >
    /NavBar>
    < /header>
    < main;
class {
}
"d-flex align-items-stretch overflow-auto" >
    /SideNav>
    < div;
class {
}
"d-flex flex-column flex-fill overflow-auto" >
    /Toolbar>
    < FormView_vue_1.default > /FormView>
    < /div>
    < /main>
    < section;
class {
}
"helpers-section" >
    /FileGallery>
    < div;
id = "snackbar" > /div>
    < BrowseFile_vue_1.default > /BrowseFile>
    < NotifyBox_vue_1.default > /NotifyBox>
    < WebSocket_vue_1.default > /WebSocket>
    < QuestionBox_vue_1.default > /QuestionBox>
    < ContextMenu_vue_1.default > /ContextMenu>
    < ProgressBar_vue_1.default > /ProgressBar>
    < !-- < geo - map > /geo-map>-->
    < /section>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const SideNav_vue_1 = tslib_1.__importDefault(require("@/components/SideNav.vue"));
const NavBar_vue_1 = tslib_1.__importDefault(require("@/components/NavBar.vue"));
const FormElem_vue_1 = tslib_1.__importDefault(require("@/components/FormElem.vue"));
const FileGallery_vue_1 = tslib_1.__importDefault(require("@/components/FileGallery.vue"));
const NotifyBox_vue_1 = tslib_1.__importDefault(require("@/components/NotifyBox.vue"));
const WebSocket_vue_1 = tslib_1.__importDefault(require("@/components/WebSocket.vue"));
const QuestionBox_vue_1 = tslib_1.__importDefault(require("@/components/QuestionBox.vue"));
const ContextMenu_vue_1 = tslib_1.__importDefault(require("@/components/ContextMenu.vue"));
const Toolbar_vue_1 = tslib_1.__importDefault(require("@/components/Toolbar.vue"));
const ProgressBar_vue_1 = tslib_1.__importDefault(require("@/components/ProgressBar.vue"));
const BrowseFile_vue_1 = tslib_1.__importDefault(require("@/components/BrowseFile.vue"));
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("./main");
const main = tslib_1.__importStar(require("./main"));
const FormView_vue_1 = tslib_1.__importDefault(require("@/components/FormView.vue"));
let App = class App extends vue_property_decorator_1.Vue {
    mounted() {
        console.log(`%c mina framework started. %c version: ${main_1.glob.config.version} %c`, 'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
    }
};
App = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        components: {
            FormView: FormView_vue_1.default,
            BrowseFile: BrowseFile_vue_1.default,
            ProgressBar: ProgressBar_vue_1.default,
            ContextMenu: ContextMenu_vue_1.default,
            QuestionBox: QuestionBox_vue_1.default,
            WebSocket: WebSocket_vue_1.default,
            NotifyBox: NotifyBox_vue_1.default,
            FileGallery: FileGallery_vue_1.default,
            FormElem: FormElem_vue_1.default,
            Toolbar: Toolbar_vue_1.default,
            SideNav: SideNav_vue_1.default,
            NavBar: NavBar_vue_1.default
        }
    })
], App);
exports.default = App;
/script>
    < style;
lang = "scss" >
;
require("../node_modules/bootstrap/scss/bootstrap.scss");
('https://fonts.googleapis.com/css?family=Roboto');
root;
{
    --primary;
    #;
    0072;
    C6;
    --danger;
    #ff4136;
    --dark;
    #;
    24292e;
    --header - bg;
    #;
    24292e;
    --warning;
    #ff7700;
    --grid - head;
    #f6f8fa;
    --grid - border;
    #d7d9dc;
    --check - box - border;
    #d7d9dc;
    --panel - separator - line;
    #dee2e6;
    --grid - row - hover;
    #f0f8ff;
    --grid - row - highlight;
    #FFC;
    --grid - row - header - highlight;
    #FFE;
    --form - label;
    #;
    666;
    --layout - border;
    #ddd;
    --side - nav - bg;
    #;
    2;
    f353c;
    --side - nav - color;
    #fff;
    --breadcrumb - separator;
    #aaa;
    --link - color;
    #;
    4285;
    f4;
    --main - body - bg;
    #eee;
    --font - size - base;
    15;
    px;
    --badge - padding - x;
    0.25;
    rem;
    --left;
    left;
    --right;
    right;
    --wide - props - width;
    500;
    px;
    --text - multiline - height;
    150;
    px;
}
$left: var ;
(--left);
$right: var ;
(--right);
html;
{
    height: 100 % ;
}
body;
{
    height: 100 % ;
    overflow: hidden;
    text - align;
    $left;
    font - family;
    Roboto, RobotoDraft, Calibri, Helvetica, Arial, sans - serif;
    font - size;
    15;
    px;
}
table;
{
    width: inherit;
}
main;
{
    flex: 1;
    1;
    auto;
    scroll - behavior;
    smooth;
}
input;
{
        & [type = date],
            & [type = time],
            & [type = datetime - local],
            & [type = month];
    {
        -webkit - appearance;
        normal;
    }
}
header;
{
    flex: 0;
    1;
    auto;
    nav;
    {
        background - color;
        var ;
        (--header - bg);
    }
    btn - toolbar;
    {
        border - color;
        var ;
        (--layout - border);
    }
}
a;
{
    color: var ;
    (--link - color);
        & ;
    hover;
    {
        color: #;
        0366;
        d6;
    }
        & ;
    focus;
    {
        outline: none;
    }
}
td;
{
    prop - focused;
    {
        outline: 1;
        px;
        solid;
        var ;
        (--primary);
    }
}
// todo: disable print
/*#print{display:none!important;}@media print{*{display:none;}}*/
/* Animations to fade the snackbar in and out */
-webkit - keyframes;
fadein;
{
    from;
    {
        bottom: 0;
        opacity: 0;
    }
    to;
    {
        bottom: 30;
        px;
        opacity: 1;
    }
}
fadein;
{
    from;
    {
        bottom: 0;
        opacity: 0;
    }
    to;
    {
        bottom: 30;
        px;
        opacity: 1;
    }
}
-webkit - keyframes;
fadeout;
{
    from;
    {
        bottom: 30;
        px;
        opacity: 1;
    }
    to;
    {
        bottom: 0;
        opacity: 0;
    }
}
fadeout;
{
    from;
    {
        bottom: 30;
        px;
        opacity: 1;
    }
    to;
    {
        bottom: 0;
        opacity: 0;
    }
}
separator - line;
{
    border - color;
    var ;
    (--panel - separator - line);
    important;
}
dropdown - menu;
{
    text - align;
    $left;
    z - index;
    10000;
    #;
    {
        $left;
    }
    0;
    #;
    {
        $right;
    }
    inherit;
}
breadcrumb - item;
{
    font - weight;
    500;
    +.breadcrumb - item;
    {
        padding - #;
        {
            $left;
        }
        0.5;
        rem;
            & ;
        before;
        {
            padding - #;
            {
                $right;
            }
            0.5;
            rem;
            padding - #;
            {
                $left;
            }
            0;
            content: "";
        }
    }
    i;
    {
        color: var ;
        (--breadcrumb - separator);
    }
}
#snackbar;
{
    visibility: hidden; /* Hidden by default. Visible on click */
    min - width;
    250;
    px; /* Set a default minimum width */
    margin - #;
    {
        $left;
    }
    -125;
    px; /* Divide value of min-width by 2 */
    background - color;
    #;
    333; /* Black background color */
    color: #fff; /* White text color */
    text - align;
    center; /* Centered text */
    border - radius;
    2;
    px; /* Rounded borders */
    padding: 16;
    px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z - index;
    1; /* Add a z-index if needed */
    left: 50 % ; /* Center the snackbar */
    bottom: 30;
    px; /* 30px from the bottom */
    visible;
    {
        visibility: visible; /* Show the snackbar */
        /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
        However, delay the fade out process for 2.5 seconds */
        -webkit - animation;
        fadein;
        0.5;
        s, fadeout;
        0.5;
        s;
        2.5;
        s;
        animation: fadein;
        0.5;
        s, fadeout;
        0.5;
        s;
        2.5;
        s;
    }
}
fa - chevron - {}
    & left;
before;
{
    //@if var(--left) == left {
    //    content: "\f053" !important;
    //} @else {
    //    content: "\f054" !important;
    //}
}
    & right;
before;
{
    //@if var(--right) == right {
    //    content: "\f054" !important;
    //} @else {
    //    content: "\f053" !important;
    //}
}
token;
{
    white - space;
    pre;
}
fade - {}
    & enter - active;
{
    transition: opacity;
    .1;
    s;
}
    & leave - active;
{
    transition: opacity;
    .8;
    s;
}
    & enter,  & leave - to;
{
    opacity: 0;
}
aside;
{
    position: sticky;
    top: 0;
}
modal;
{
    prop - comment;
    {
        //background-color: inherit;
        //border: none;
        //padding: 0 !important;
        //color: gray;
    }
}
modal - mask;
{
    position: fixed;
    z - index;
    9998;
    top: 0;
    left: 0;
    width: 100 % ;
    height: 100 % ;
    background - color;
    rgba(0, 0, 0, .5);
    display: table;
    transition: opacity;
    .3;
    s;
    ease;
}
modal - wrapper;
{
    display: table - cell;
}
/style>;
//# sourceMappingURL=App.vue.js.map