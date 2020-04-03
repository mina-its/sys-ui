import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
const $ = require('jquery');
const main = require("@/main");
let PropReferenceMultiple = class PropReferenceMultiple extends Vue {
    update() {
        let val = event.target.value;
        let items = val == "" ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        items.forEach(item => item.hover = false);
        this.showDropDown(items);
    }
    refreshText() {
        let val = this.doc[this.prop.name];
        this.doc[this.prop.name] = null;
        this.doc[this.prop.name] = val;
    }
    focus() {
        $(this.$refs.ctrl).find("textarea").focus();
    }
    remove(item) {
        let val = this.doc[this.prop.name];
        this.doc[this.prop.name] = val.filter(v => JSON.stringify(v) != JSON.stringify(item.ref));
        return { prop: this.prop, val };
    }
    showDropDown(items) {
        let valueStrKeys = this.value.map(v => JSON.stringify(v));
        items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        main.showCmenu(this.prop, items, { ctrl: this.$refs.ctrl }, (state, item) => this.selectItem(item));
    }
    selectItem(item) {
        if (item == null) { // Esc
            this.refreshText();
            return;
        }
        let val = this.doc[this.prop.name];
        if (!val)
            this.doc[this.prop.name] = val = [];
        val.push(item.ref);
        return { prop: this.prop, val: this.value };
    }
    get value() {
        let val = this.doc[this.prop.name];
        if (!val)
            this.doc[this.prop.name] = val = [];
        else if (!Array.isArray(val))
            val = [val];
        return val;
    }
    get items() {
        let items = [];
        for (const v of this.value) {
            let item = this.prop._.items.find(i => main.equalRef(v, i.ref));
            if (item)
                items.push(item);
            else
                items.push({ title: "...", ref: v });
        }
        return items;
    }
};
__decorate([
    Prop()
], PropReferenceMultiple.prototype, "type", void 0);
__decorate([
    Prop()
], PropReferenceMultiple.prototype, "doc", void 0);
__decorate([
    Prop()
], PropReferenceMultiple.prototype, "prop", void 0);
__decorate([
    Prop()
], PropReferenceMultiple.prototype, "styles", void 0);
__decorate([
    Emit('changed')
], PropReferenceMultiple.prototype, "remove", null);
__decorate([
    Emit('changed')
], PropReferenceMultiple.prototype, "selectItem", null);
PropReferenceMultiple = __decorate([
    Component
], PropReferenceMultiple);
export default PropReferenceMultiple;
//# sourceMappingURL=PropReferenceMultiple.vue.js.map