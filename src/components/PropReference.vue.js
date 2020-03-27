import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let PropReference = class PropReference extends Vue {
    keydown(e) {
        if (e.which === Keys.up || e.which === Keys.down) {
            e.preventDefault();
        }
        if (!st.cmenu.show)
            this.$emit('keydown', e);
    }
    update() {
        let val = event.target.value;
        let items = val == "" ? prop(this)._.items : _.filter(prop(this)._.items, (item) => {
            return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
        items.forEach((item) => {
            item.hover = false;
        });
        this.showDropDown(items);
    }
    refreshText() {
        let val = this.doc[prop(this).name];
        this.doc[prop(this).name] = null;
        this.doc[prop(this).name] = val;
    }
    showDropDown(items) {
        if (!prop(this).required && items && items.length)
            items = [{ ref: null, title: "", hover: false }].concat(items);
        main.showCmenu(prop(this), items, { ctrl: this.$refs.ctrl }, (state, item) => {
            if (item == null) { // Esc
                this.refreshText();
                return;
            }
            this.doc[prop(this).name] = null;
            this.doc[prop(this).name] = item.ref;
            this.$emit("changed", prop(this), this.value);
        });
    }
    get value() {
        return main.getPropReferenceValue(prop(this), this.doc);
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
], PropReference.prototype, "meta", void 0);
PropReference = __decorate([
    Component
], PropReference);
export default PropReference;
//# sourceMappingURL=PropReference.vue.js.map