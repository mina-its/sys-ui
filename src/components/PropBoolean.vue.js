import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let PropBoolean = class PropBoolean extends Vue {
    keydown(e) {
        this.$emit('keydown', e);
    }
    update() {
        this.doc[prop(this).name] = event.target.checked;
        this.$emit("changed", prop(this), this.value);
    }
    get value() {
        return this.doc[prop(this).name];
    }
};
__decorate([
    Prop()
], PropBoolean.prototype, "meta", void 0);
__decorate([
    Prop()
], PropBoolean.prototype, "doc", void 0);
PropBoolean = __decorate([
    Component
], PropBoolean);
export default PropBoolean;
//# sourceMappingURL=PropBoolean.vue.js.map