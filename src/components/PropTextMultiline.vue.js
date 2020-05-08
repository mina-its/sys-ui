"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
let PropTextMultiline = class PropTextMultiline extends vue_property_decorator_1.Vue {
    update(e) {
        let text = e.target.value;
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
    focus(e) {
        return { prop: this.prop, event: e };
    }
    get value() {
        return main.getPropTextValue(this.prop, this.doc);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTextMultiline.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTextMultiline.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTextMultiline.prototype, "readOnly", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropTextMultiline.prototype, "update", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('focus')
], PropTextMultiline.prototype, "focus", null);
PropTextMultiline = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropTextMultiline' })
], PropTextMultiline);
exports.default = PropTextMultiline;
//# sourceMappingURL=PropTextMultiline.vue.js.map