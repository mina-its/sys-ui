"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("../main"));
const main_1 = require("../main");
const main_2 = require("@/main");
const types_2 = require("../types");
let PropReference = /** @class */ (() => {
    let PropReference = class PropReference extends vue_property_decorator_1.Vue {
        keydown(e) {
            if (main_2.glob.cmenu.show && (e.which === types_1.Keys.up || e.which === types_1.Keys.down)) {
                e.preventDefault();
            }
            if (!main_2.glob.cmenu.show)
                return { prop: this.prop, event: e };
        }
        update(e) {
            if (this.readOnly)
                return;
            let val = e.target.value;
            // console.log(val);
            if (this.prop._.isRef) {
                // console.log(this.prop);
                let query = this.prop.filter ? main_1.parse(main_1.processThisExpression(this.doc, this.prop.filter), true, types_2.ID) : null;
                let instance = this.doc;
                if (this.prop.referType == types_1.PropertyReferType.InnerSelectType) {
                    let match = this.prop._.ref.match(/^(\w+\/\w+)/);
                    instance = this.$store.state.data[match[1]];
                }
                let data = { prop: this.prop, instance, phrase: val, query };
                console.log(data);
                console.log(main_1.stringify(data, true));
                main_2.call('getPropertyReferenceValues', data, (err, res) => {
                    if (err)
                        main_2.notify(err);
                    else {
                        for (let item of res.data) {
                            if (!this.prop._.items.find(i => i.ref == item.ref))
                                this.prop._.items.push(item);
                        }
                        this.showDropDown(res.data);
                    }
                });
            }
            else {
                let items = val == null || (this.prop._.items.length < types_2.Constants.contextMenuVisibleItems && val == this.value) ? this.prop._.items : this.prop._.items.filter(item => item.title && item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
                items.forEach(item => item.hover = val == item.title);
                this.showDropDown(items);
            }
        }
        refreshText() {
            this.$refs.ctrl.value = this.value;
        }
        showDropDown(items) {
            if (!this.prop.required && items && items.length)
                items = [{ ref: null, title: "", hover: false }].concat(items);
            main.showCmenu(this.prop, items, { ctrl: this.$refs.ctrl }, (state, item) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                if (!main.equalID(this.doc[this.prop.name], item.ref)) {
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
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReference.prototype, "type", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReference.prototype, "doc", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReference.prototype, "prop", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], PropReference.prototype, "readOnly", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('keydown')
    ], PropReference.prototype, "keydown", null);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('changed')
    ], PropReference.prototype, "selectItem", null);
    PropReference = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'PropReference' })
    ], PropReference);
    return PropReference;
})();
exports.default = PropReference;
//# sourceMappingURL=PropReference.vue.js.map