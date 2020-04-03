import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Keys } from "../../../sys/src/types";
import { glob } from "@/main";
import { Constants } from '@/types';
const main = require("@/main");
let PropReference = class PropReference extends Vue {
    keydown(e) {
        if (glob.cmenu.show && (e.which === Keys.up || e.which === Keys.down)) {
            e.preventDefault();
        }
        if (!glob.cmenu.show)
            return { e };
    }
    update(e) {
        let val = e.target.value;
        let items = !val || (this.prop._.items.length < Constants.contextMenuVisibleItems && val == this.value) ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        items.forEach(item => item.hover = val == item.title);
        this.showDropDown(items);
    }
    refreshText() {
        let val = this.doc[this.prop.name];
        this.doc[this.prop.name] = null;
        this.doc[this.prop.name] = val;
    }
    showDropDown(items) {
        if (!this.prop.required && items && items.length)
            items = [{ ref: null, title: "", hover: false }].concat(items);
        main.showCmenu(this.prop, items, { ctrl: this.$refs.ctrl }, (state, item) => {
            if (item == null) { // Esc
                this.refreshText();
                return;
            }
            if (!main.equalRef(this.doc[this.prop.name], item.ref)) {
                this.selectItem(item.ref);
            }
        });
    }
    selectItem(val) {
        return { prop: this.prop, val, vue: this };
    }
    get value() {
        return main.getPropReferenceValue(this.prop, this.doc);
    }
};
__decorate([
    Prop()
], PropReference.prototype, "type", void 0);
__decorate([
    Prop()
], PropReference.prototype, "doc", void 0);
__decorate([
    Prop()
], PropReference.prototype, "prop", void 0);
__decorate([
    Emit('keydown')
], PropReference.prototype, "keydown", null);
__decorate([
    Emit('changed')
], PropReference.prototype, "selectItem", null);
PropReference = __decorate([
    Component
], PropReference);
export default PropReference;
//# sourceMappingURL=PropReference.vue.js.map