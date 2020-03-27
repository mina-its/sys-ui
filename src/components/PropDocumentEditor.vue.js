import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let PropDocumentEditor = class PropDocumentEditor extends Vue {
    keydown(e) {
        this.$emit('keydown', e);
    }
    update(e) {
        try {
            let val = e.target.value ? JSON.parse(e.target.value) : null;
            this.invalidData = false;
            this.doc[prop(this).name] = val;
            let ref = prop(this)._.ref.replace(new RegExp(`/${prop(this).name}$`), "");
            let data = {};
            data[prop(this).name] = val;
            glob.md.push({ type: WebMethod.patch, ref, data });
            glob.od[ref][prop(this).name] = JSON.parse(JSON.stringify(val));
            this.$emit("changed", prop(this), val);
        }
        catch (ex) {
            //this.doc._error = `Property '${prop(this).title}' invalid data.`;
            this.invalidData = true;
            st.dirty = true;
        }
    }
    get value() {
        if (this.invalidData) {
            return this.$el.value;
        }
        else {
            let val = this.doc[prop(this).name];
            return val ? JSON.stringify(val) : "";
        }
    }
};
__decorate([
    Prop()
], PropDocumentEditor.prototype, "doc", void 0);
__decorate([
    Prop()
], PropDocumentEditor.prototype, "meta", void 0);
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