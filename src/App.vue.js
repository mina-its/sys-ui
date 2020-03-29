import { __decorate } from "tslib";
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
    < div;
class {
}
"main-body h-100 overflow-auto w-100 d-flex";
"onScroll()" >
    v - ;
for ( = "elem in glob.form.elems"; ; )
    : elem = "elem" > /FormElem>
        < /div>
        < /div>
        < /main>
        < section;
class {
}
"helpers-section" >
    /FileGallery>
    < div;
id = "snackbar" > /div>
    < input;
id = "file-browse";
type = "file";
class {
}
"d-none";
"fileBrowsed";
style = "width: 0;height: 0;";
multiple = "true" >
    /NotifyBox>
    < WebSocket > /WebSocket>
    < QuestionBox > /QuestionBox>
    < ContextMenu > /ContextMenu>
    < !-- < geo - map > /geo-map>-->
    < /section>
    < /div>
    < /template>
    < script;
lang = "ts" >
    declare;
let $;
import { Component, Vue } from 'vue-property-decorator';
import { $t, hideCmenu, load, notify, glob } from "@/main";
import { LogType } from '../../sys/src/types';
import SideNav from "@/components/SideNav.vue";
import NavBar from './components/NavBar.vue';
import FormElem from "@/components/FormElem.vue";
import FileGallery from "@/components/FileGallery.vue";
import NotifyBox from "@/components/NotifyBox.vue";
import WebSocket from "@/components/WebSocket.vue";
import QuestionBox from "@/components/QuestionBox.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Toolbar from "@/components/Toolbar.vue";
const main = require("@/main");
let App = class App extends Vue {
    get glob() {
        return glob;
    }
    onScroll() {
        main.hideCmenu();
    }
    fileBrowsed(e) {
        console.log("fileBrowsed!");
        glob.fileGallery.fileBrowsed(e.target.files);
    }
    handleWindowEvents() {
        $(window)
            .on('notify', function (e) {
            let notify = e.detail;
            if (notify.type == LogType.Debug) {
                $("#snackbar").addClass("visible").text(notify.message);
                setTimeout(function () {
                    $("#snackbar").removeClass("visible");
                }, 3000);
            }
            else
                main.updateRoot({ notify });
        })
            .on('question', function (e) {
            main.updateRoot({ question: e.detail });
        })
            .on("popstate", (e) => {
            load(location.href);
        })
            .on("beforeunload", (e) => {
            if (glob.dirty) {
                e = e || window.event;
                if (e)
                    e.returnValue = $t('save-before');
                return $t('save-before');
            }
        })
            .on("resize", (e) => {
            hideCmenu();
        })
            .on("keydown", (e) => {
            if (glob.cmenu.show)
                main.handleCmenuKeys(e);
            main.updateRoot({ notify: null });
        })
            .on("click", (e) => {
            if (e.target.tagName == "A") {
                if (e.target.getAttribute('target'))
                    return; // especially _blank
                let href = e.target.getAttribute('href');
                if (href) {
                    if (href.match(/^javascript/) || /^#/.test(href))
                        return; // if (/^#/.test(href)) return false;
                    e.preventDefault();
                    if (glob.dirty) {
                        notify($t('save-before'), LogType.Warning);
                        return;
                    } // dirty page
                    if (/\bf=\d/.test(href)) { // function link
                    }
                    else
                        history.pushState(null, null, href);
                    load(href);
                }
            }
        })
            .on("mouseup", (e) => {
            if (glob.cmenu.show &&
                !$('.dropdown-item').is(e.target)
                && $('.dropdown-item').has(e.target).length === 0
                && $('.dropdown-menu.show').has(e.target).length === 0)
                hideCmenu();
        });
    }
    mounted() {
        this.handleWindowEvents();
        console.log(`%c main started. %c version: ${glob.config.version} %c`, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
    }
};
App = __decorate([
    Component({
        components: {
            ContextMenu,
            QuestionBox,
            WebSocket,
            NotifyBox,
            FileGallery,
            FormElem,
            Toolbar,
            SideNav,
            NavBar
        }
    })
], App);
export default App;
/script>
    < style;
lang = "scss" >
    $left;
left;
$right: right;
root;
{
    --primary;
    0072;
    C6;
    --danger;
    ff4136;
    --dark;
    24292e;
    --warning;
    ff7700;
    --grid - head;
    f6f8fa;
    --grid - border;
    d7d9dc;
    --panel - separator - line;
    dee2e6;
    --grid - row - hover;
    f0f8ff;
    --grid - row - selected;
    FFC;
    --grid - row - header - selected;
    FFE;
    --form - label;
    666;
    --layout - border;
    ddd;
    --side - nav;
    2;
    f353c;
    --breadcrumb - separator;
    aaa;
}
import "bootstrap";
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
    -apple - system, BlinkMacSystemFont, Segoe;
    UI, Helvetica, Arial, sans - serif, Apple;
    Color;
    Emoji, Segoe;
    UI;
    Emoji;
    font - size;
    15;
    px;
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
    btn - toolbar;
    {
        border - color;
        var ;
        (--layout - border);
    }
}
a;
{
    color: ;
    0366;
    d6;
        & ;
    hover;
    {
        color: ;
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
    {
        $left;
    }
    0;
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
        padding - ;
        {
            $left;
        }
        0.5;
        rem;
            & ;
        before;
        {
            padding - ;
            {
                $right;
            }
            0.5;
            rem;
            padding - ;
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
snackbar;
{
    visibility: hidden; /* Hidden by default. Visible on click */
    min - width;
    250;
    px; /* Set a default minimum width */
    margin - ;
    {
        $left;
    }
    -125;
    px; /* Divide value of min-width by 2 */
    background - color;
    333; /* Black background color */
    color: ;
    fff; /* White text color */
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
    if ($left == left) {
        content: "\f053";
        important;
    }
    {
        content: "\f054";
        important;
    }
}
    & right;
before;
{
    if ($right == right) {
        content: "\f054";
        important;
    }
    {
        content: "\f053";
        important;
    }
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
/style>;
//# sourceMappingURL=App.vue.js.map