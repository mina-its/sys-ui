"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
let PropText = class PropText extends vue_property_decorator_1.Vue {
    keydown(e) {
        if (e.which === types_1.Keys.up || e.which === types_1.Keys.down)
            e.preventDefault();
        return { prop: this.prop, event: e };
    }
    focus(e) {
        return { prop: this.prop, event: e };
    }
    update(e) {
        let text = this.type == "number" ? e.target.valueAsNumber : e.target.value;
        if (text === "")
            text = null;
        let val = this.doc[this.prop.name];
        if (this.prop.text && this.prop.text.multiLanguage) {
            if (val == null)
                this.$set(this.doc, this.prop.name, {});
            if (main_1.glob.config.locale) {
                if (typeof val == 'string') {
                    let oldValue = val;
                    val = {};
                    val[main_1.glob.config.defaultLocale] = oldValue;
                    val[main_1.glob.config.locale] = text;
                    this.$set(this.doc, this.prop.name, val);
                }
                else
                    val = val || {};
                this.$set(this.doc[this.prop.name], main_1.glob.config.locale, text);
                val[main_1.glob.config.locale] = text;
            }
            else {
                if (val && typeof val == 'object' && main_1.glob.config.defaultLocale) {
                    this.$set(this.doc[this.prop.name], main_1.glob.config.defaultLocale, text);
                    val[main_1.glob.config.defaultLocale] = text;
                }
                else
                    val = text;
            }
        }
        else
            val = text;
        return { prop: this.prop, val, vue: this };
    }
    get readonly() {
        return !!this.prop.formula;
    }
    get value() {
        return main.getPropTextValue(this.prop, this.doc);
    }
    get placeholder() {
        if (!this.doc || this.prop.formula)
            return null;
        let val = this.doc[this.prop.name];
        if (val && typeof val === "object") {
            let locale = main.getQs('e') || "en";
            if (!val[locale])
                return val["en"] || val[Object.keys(val)[0]];
        }
        return null;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropText.prototype, "type", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropText.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropText.prototype, "viewType", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropText.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit("keydown")
], PropText.prototype, "keydown", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('focus')
], PropText.prototype, "focus", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit("changed")
], PropText.prototype, "update", null);
PropText = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropText' })
], PropText);
exports.default = PropText;
//# sourceMappingURL=PropText.vue.js.map