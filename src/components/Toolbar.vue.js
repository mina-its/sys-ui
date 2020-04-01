import { __decorate } from "tslib";
import Function from "@/components/Function.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { prepareServerUrl, $t, flat2recursive, glob } from "@/main";
import { Keys, WebMethod, LogType } from '../../../sys/src/types';
const $ = require('jquery');
const main = require("@/main");
let Toolbar = class Toolbar extends Vue {
    $t(key) {
        return main.$t(key);
    }
    mounted() {
        $(window).on("keydown", (e) => {
            if (e.ctrlKey && e.which == Keys.s) {
                this.apply();
                return false;
            }
        });
    }
    apply(cn, done) {
        main.updateStateRoot({ notify: null });
        if (!done)
            done = () => {
                main.log('Apply done!');
            };
        if (!main.validate())
            return done();
        if (main.getQs("n") == "true")
            return main.commitNewItem();
        this.commitModify(done);
    }
    cancel() {
        glob.dirty = false;
        if (main.getQs("n") == "true")
            location.href = location.pathname;
        else
            location.reload();
    }
    clickTitlePin() {
        console.log('clickTitlePin');
    }
    commitModify(done) {
        if (glob.modifies.length == 0) {
            main.notify($t('saved'), LogType.Debug);
            glob.dirty = false;
            return done();
        }
        let modify = glob.modifies.pop();
        //main.log(modify.type, modify.ref, modify.data);
        main.ajax(prepareServerUrl(modify.ref), modify.data, { method: modify.type }, (res) => {
            res.data = flat2recursive(res.data);
            if (modify.type === WebMethod.post || modify.type == WebMethod.patch)
                Object.assign(modify.data, res.data);
            if (res.redirect && glob.modifies.length == 0)
                return main.handleResponseRedirect(res);
            else
                this.commitModify(done);
        }, (err) => {
            done(err);
            main.notify(err);
        });
    }
};
__decorate([
    Prop()
], Toolbar.prototype, "alwaysVisible", void 0);
Toolbar = __decorate([
    Component({ components: { Function } })
], Toolbar);
export default Toolbar;
//# sourceMappingURL=Toolbar.vue.js.map