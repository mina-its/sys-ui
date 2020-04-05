"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const SideNav_vue_1 = tslib_1.__importDefault(require("@/components/SideNav.vue"));
const NavBar_vue_1 = tslib_1.__importDefault(require("./components/NavBar.vue"));
const FormElem_vue_1 = tslib_1.__importDefault(require("@/components/FormElem.vue"));
const FileGallery_vue_1 = tslib_1.__importDefault(require("@/components/FileGallery.vue"));
const NotifyBox_vue_1 = tslib_1.__importDefault(require("@/components/NotifyBox.vue"));
const WebSocket_vue_1 = tslib_1.__importDefault(require("@/components/WebSocket.vue"));
const QuestionBox_vue_1 = tslib_1.__importDefault(require("@/components/QuestionBox.vue"));
const ContextMenu_vue_1 = tslib_1.__importDefault(require("@/components/ContextMenu.vue"));
const Toolbar_vue_1 = tslib_1.__importDefault(require("@/components/Toolbar.vue"));
const types_2 = require("../../sys/src/types");
const ProgressBar_vue_1 = tslib_1.__importDefault(require("@/components/ProgressBar.vue"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const main = tslib_1.__importStar(require("@/main"));
const BrowseFile_vue_1 = tslib_1.__importDefault(require("@/components/BrowseFile.vue"));
let App = class App extends vue_property_decorator_1.Vue {
    onScroll() {
        main.hideCmenu();
    }
    handleWindowEvents() {
        jquery_1.default(window)
            .on(types_1.Constants.notifyEvent, function (e) {
            let notify = e.detail;
            if (notify.type == types_2.LogType.Debug) {
                jquery_1.default("#snackbar").addClass("visible").text(notify.message);
                setTimeout(function () {
                    jquery_1.default("#snackbar").removeClass("visible");
                }, 3000);
            }
            else
                main_1.glob.notify = notify;
        })
            .on(types_1.Constants.questionEvent, function (e) {
            main_1.glob.question = e.detail;
        })
            .on("popstate", (e) => {
            main_1.load(location.href);
        })
            .on("beforeunload", (e) => {
            if (main_1.glob.dirty) {
                e = e || window.event;
                if (e)
                    e.returnValue = main_1.$t('save-before');
                return main_1.$t('save-before');
            }
        })
            .on("resize", (e) => {
            main_1.hideCmenu();
        })
            .on("keydown", (e) => {
            if (main_1.glob.cmenu.show)
                main.handleCmenuKeys(e);
            main_1.glob.notify = null;
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
                    if (main_1.glob.dirty) {
                        main_1.notify(main_1.$t('save-before'), types_2.LogType.Warning);
                        return;
                    } // dirty page
                    if (/\bf=\d/.test(href)) { // function link
                    }
                    else
                        history.pushState(null, null, href);
                    main_1.load(href);
                }
            }
        })
            .on("mouseup", (e) => {
            if (main_1.glob.cmenu.show &&
                !jquery_1.default('.dropdown-item').is(e.target)
                && jquery_1.default('.dropdown-item').has(e.target).length === 0
                && jquery_1.default('.dropdown-menu.show').has(e.target).length === 0)
                main_1.hideCmenu();
        });
    }
    mounted() {
        this.handleWindowEvents();
        console.log(`%c mina framework started. %c version: ${main_1.glob.config.version} %c`, 'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
    }
};
App = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        components: {
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
//# sourceMappingURL=App.vue.js.map