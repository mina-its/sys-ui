"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
//# sourceMappingURL=App.vue.js.map