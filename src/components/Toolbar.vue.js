import { __decorate } from "tslib";
import Function from "@/components/Function.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { glob } from "@/main";
import { Keys } from '../../../sys/src/types';
const $ = require('jquery');
const main = require("@/main");
let Toolbar = class Toolbar extends Vue {
    mounted() {
        $(window).on("keydown", (e) => {
            if (e.ctrlKey && e.which == Keys.s) {
                this.apply({});
                return false;
            }
        });
    }
    cancel(e) {
        glob.dirty = false;
        if (main.getQs("n") == "true")
            location.href = location.pathname;
        else
            location.reload();
    }
    clickTitlePin(e) {
        console.log('clickTitlePin');
    }
    apply(e) {
        glob.notify = null;
        if (!e.then)
            e.then = () => main.log('Apply done!');
        if (!main.validate(this.$store.state.data))
            return e.then();
        if (main.getQs("n") == "true")
            return main.commitNewItem();
        main.dispatchRequestServerModify(this.$store, e.then);
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