import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
let CheckBox = class CheckBox extends Vue {
    changed() {
        return { val: !this.checked };
    }
    keydown(e) {
        return e;
    }
};
__decorate([
    Prop()
], CheckBox.prototype, "checked", void 0);
__decorate([
    Prop()
], CheckBox.prototype, "label", void 0);
__decorate([
    Emit('changed')
], CheckBox.prototype, "changed", null);
__decorate([
    Emit('keydown')
], CheckBox.prototype, "keydown", null);
CheckBox = __decorate([
    Component
], CheckBox);
export default CheckBox;
//# sourceMappingURL=CheckBox.vue.js.map