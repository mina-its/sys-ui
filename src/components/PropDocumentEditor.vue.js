import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { WebMethod } from "../../../sys/src/types";
import { glob } from "@/main";
const main = require("@/main");
let PropDocumentEditor = class PropDocumentEditor extends Vue {
    keydown(e) {
        this.$emit('keydown', e);
    }
    update(e) {
        try {
            let val = e.target.value ? JSON.parse(e.target.value) : null;
            this.invalidData = false;
            this.doc[this.prop.name] = val;
            let ref = this.prop._.ref.replace(new RegExp(`/${this.prop.name}$`), "");
            let data = {};
            data[this.prop.name] = val;
            glob.modifies.push({ type: WebMethod.patch, ref, data });
            glob.modifies[ref][this.prop.name] = JSON.parse(JSON.stringify(val));
            this.$emit("changed", this.prop, val);
        }
        catch (ex) {
            //this.doc._error = `Property '${this.prop.title}' invalid data.`;
            this.invalidData = true;
            glob.dirty = true;
        }
    }
    get value() {
        if (this.invalidData) {
            return this.$el.value;
        }
        else {
            let val = this.doc[this.prop.name];
            return val ? JSON.stringify(val) : "";
        }
    }
};
__decorate([
    Prop()
], PropDocumentEditor.prototype, "doc", void 0);
__decorate([
    Prop()
], PropDocumentEditor.prototype, "prop", void 0);
__decorate([
    Prop()
], PropDocumentEditor.prototype, "styles", void 0);
__decorate([
    Prop()
], PropDocumentEditor.prototype, "invalidData", void 0);
PropDocumentEditor = __decorate([
    Component
], PropDocumentEditor);
export default PropDocumentEditor;
//# sourceMappingURL=PropDocumentEditor.vue.js.map