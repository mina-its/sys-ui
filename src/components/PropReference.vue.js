"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("../main"));
const main_1 = require("../main");
const main_2 = require("@/main");
let PropReference = /** @class */ (() => {
    let PropReference = class PropReference extends vue_property_decorator_1.Vue {
        keydown(e) {
            if (main_2.glob.cmenu.show && (e.which === types_1.Keys.up || e.which === types_1.Keys.down)) {
                e.preventDefault();
            }
            if (!main_2.glob.cmenu.show)
                return { prop: this.prop, event: e };
        }
        click(e) {
            this.update(e, true);
        }
        update(e, clicked) {
            if (this.readOnly)
                return;
            let val = e.target.value;
            main_1.showPropRefMenu(this.prop, this.doc, clicked ? "" : val, this.$refs.ctrl, false, (item) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                if (!main.equalID(this.doc[this.prop.name], item.ref)) {
                    this.selectItem(item.ref);
                }
            });
        }
        refreshText() {
            this.$refs.ctrl.value = this.value;
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