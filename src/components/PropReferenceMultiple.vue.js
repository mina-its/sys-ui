"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main = tslib_1.__importStar(require("../main"));
const main_1 = require("../main");
let PropReferenceMultiple = /** @class */ (() => {
    let PropReferenceMultiple = class PropReferenceMultiple extends vue_property_decorator_1.Vue {
        update(e, clicked) {
            // let val = (event.target as any).value;
            // let items = val == "" ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            // items.forEach(item => (item as MenuItem).hover = false);
            // this.showDropDown(items);
            if (this.readOnly)
                return;
            let val = e.target.value;
            main_1.showPropRefMenu(this.prop, this.doc, clicked ? "" : val, this.$refs.ctrl, true, (item) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                this.selectItem(item);
            });
        }
        click(e) {
            this.update(e, true);
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
            val = val.filter(v => !main.equalID(v, item.ref));
            return { prop: this.prop, val, vue: this };
        }
        // showDropDown(items) {
        //     let valueStrKeys = this.value.map(v => JSON.stringify(v));
        //     items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        //     main.showCmenu(this.prop, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => this.selectItem(item));
        // }
        selectItem(item) {
            if (!item) { // Esc
                this.refreshText();
                return;
            }
            let val = this.doc[this.prop.name];
            if (!val)
                val = [];
            val = [...val];
            val.push(item.ref);
            return { prop: this.prop, val, vue: this };
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
            console.log(this.value);
            let items = [];
            for (const v of this.value) {
                let item = this.prop._.items.find(i => main.equalID(v, i.ref));
                if (item)
                    items.push(item);
                else
                    items.push({ title: "...", ref: v });
            }
            return items;
        }
    };
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReferenceMultiple.prototype, "type", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReferenceMultiple.prototype, "doc", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReferenceMultiple.prototype, "prop", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReferenceMultiple.prototype, "styles", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReferenceMultiple.prototype, "readOnly", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('changed')
    ], PropReferenceMultiple.prototype, "remove", null);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('changed')
    ], PropReferenceMultiple.prototype, "selectItem", null);
    PropReferenceMultiple = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'PropReferenceMultiple' })
    ], PropReferenceMultiple);
    return PropReferenceMultiple;
})();
exports.default = PropReferenceMultiple;
//# sourceMappingURL=PropReferenceMultiple.vue.js.map