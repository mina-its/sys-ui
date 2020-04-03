import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
let PropBoolean = class PropBoolean extends Vue {
    keydown(e) {
        return { e };
    }
    change(e) {
        return { prop: this.prop, val: e.val, vue: this };
    }
    get checked() {
        return !!this.doc[this.prop.name];
    }
};
__decorate([
    Prop()
], PropBoolean.prototype, "prop", void 0);
__decorate([
    Prop()
], PropBoolean.prototype, "doc", void 0);
__decorate([
    Emit('keydown')
], PropBoolean.prototype, "keydown", null);
__decorate([
    Emit('changed')
], PropBoolean.prototype, "change", null);
PropBoolean = __decorate([
    Component
], PropBoolean);
export default PropBoolean;
//# sourceMappingURL=PropBoolean.vue.js.map