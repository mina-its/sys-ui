import { Vue } from 'vue-property-decorator';
import { $t, hideCmenu, load, notify } from "@/main";
import { LogType } from '../../sys/src/types';
const main = require("./main");
export default class App extends Vue {
    onScroll() {
        main.hideCmenu();
    }
    fileBrowsed(e) {
        console.log("fileBrowsed!");
        this.$store.state.fileGallery.fileBrowsed(e.target.files);
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
            if (this.$store.state.dirty) {
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
            if (this.$store.state.cmenu.show)
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
                    if (this.$store.state.dirty) {
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
            if (this.$store.state.cmenu.show &&
                !$('.dropdown-item').is(e.target)
                && $('.dropdown-item').has(e.target).length === 0
                && $('.dropdown-menu.show').has(e.target).length === 0)
                hideCmenu();
        });
    }
    mounted() {
        this.handleWindowEvents();
        console.log(`%c main started. %c version: ${this.$store.state.config.version} %c`, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
    }
    get form() {
        return this.$store.state.form;
    }
}
//# sourceMappingURL=App.vue.js.map