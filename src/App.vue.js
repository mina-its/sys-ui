import { __decorate } from "tslib";
import { Constants } from "@/types";
import { Component, Vue } from 'vue-property-decorator';
import { $t, hideCmenu, load, notify, glob } from "@/main";
import SideNav from "@/components/SideNav.vue";
import NavBar from './components/NavBar.vue';
import FormElem from "@/components/FormElem.vue";
import FileGallery from "@/components/FileGallery.vue";
import NotifyBox from "@/components/NotifyBox.vue";
import WebSocket from "@/components/WebSocket.vue";
import QuestionBox from "@/components/QuestionBox.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import Toolbar from "@/components/Toolbar.vue";
import { LogType } from '../../sys/src/types';
const main = require("@/main");
let App = class App extends Vue {
    onScroll() {
        main.hideCmenu();
    }
    fileBrowsed(e) {
        console.log("fileBrowsed!");
        glob.fileGallery.fileBrowsed(e.target.files);
    }
    handleWindowEvents() {
        $(window)
            .on(Constants.notifyEvent, function (e) {
            let notify = e.detail;
            if (notify.type == LogType.Debug) {
                $("#snackbar").addClass("visible").text(notify.message);
                setTimeout(function () {
                    $("#snackbar").removeClass("visible");
                }, 3000);
            }
            else
                glob.notify = notify;
        })
            .on(Constants.questionEvent, function (e) {
            glob.question = e.detail;
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
            glob.notify = null;
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
        console.log(`%c mina framework started. %c version: ${glob.config.version} %c`, 'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
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
//# sourceMappingURL=App.vue.js.map