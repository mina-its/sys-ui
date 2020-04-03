import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { Keys } from "../../../sys/src/types";
import { getQs } from "@/main";
const main = require("@/main");
let PropText = class PropText extends Vue {
    keydown(e) {
        if (e.which === Keys.up || e.which === Keys.down)
            e.preventDefault();
        return { e };
    }
    update(e) {
        let text = this.type == "number" ? e.target.valueAsNumber : e.target.value;
        if (text === "")
            text = null;
        let locale = getQs('e') || 'en';
        let val = this.doc[this.prop.name];
        if (this.prop.text && this.prop.text.multiLanguage) {
            if (locale) {
                if (typeof val == 'string')
                    val = { 'en': val };
                else
                    val = val || {};
                val[locale] = text;
            }
            else {
                if (val && typeof val == 'object')
                    val['en'] = text;
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
__decorate([
    Prop()
], PropText.prototype, "type", void 0);
__decorate([
    Prop()
], PropText.prototype, "doc", void 0);
__decorate([
    Prop()
], PropText.prototype, "viewType", void 0);
__decorate([
    Prop()
], PropText.prototype, "prop", void 0);
__decorate([
    Emit("keydown")
], PropText.prototype, "keydown", null);
__decorate([
    Emit("changed")
], PropText.prototype, "update", null);
PropText = __decorate([
    Component
], PropText);
export default PropText;
//# sourceMappingURL=PropText.vue.js.map