import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
const main = require("./main");
let PropReferenceMultiple = class PropReferenceMultiple extends Vue {
    update() {
        let val = event.target.value;
        let items = val == "" ? this.meta._.items : _.filter(this.meta._.items, (item) => {
            return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
        items.forEach((item) => {
            item.hover = false;
        });
        this.showDropDown(items);
    }
    refreshText() {
        let val = this.doc[this.meta.name];
        this.doc[this.meta.name] = null;
        this.doc[this.meta.name] = val;
    }
    remove(item) {
        let val = this.doc[this.meta.name];
        this.doc[this.meta.name] = val.filter(v => JSON.stringify(v) != JSON.stringify(item.ref));
        this.$emit("changed", this.meta, val);
    }
    showDropDown(items) {
        let valueStrKeys = this.value.map((v) => {
            return JSON.stringify(v);
        });
        items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        main.showCmenu(this.meta, items, { ctrl: this.$refs.ctrl }, (state, item) => {
            if (item == null) { // Esc
                this.refreshText();
                return;
            }
            let val = this.doc[prop(this).name];
            if (!val)
                this.doc[prop(this).name] = val = [];
            val.push(item.ref);
            this.$emit("changed", prop(this), val);
        });
    }
    get value() {
        let val = this.doc[prop(this).name];
        if (!val)
            this.doc[prop(this).name] = val = [];
        else if (!Array.isArray(val))
            val = [val];
        return val;
    }
    get items() {
        let items = [];
        for (let v of this.value) {
            let item = _.find(prop(this)._.items, { ref: v });
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
], PropReferenceMultiple.prototype, "meta", void 0);
__decorate([
    Prop()
], PropReferenceMultiple.prototype, "styles", void 0);
PropReferenceMultiple = __decorate([
    Component
], PropReferenceMultiple);
export default PropReferenceMultiple;
//# sourceMappingURL=PropReferenceMultiple.vue.js.map