"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
-box;
label = "label";
checked = "checked";
"change" > /check-box>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
let PropBoolean = class PropBoolean extends vue_property_decorator_1.Vue {
    keydown(e) {
        return { e };
    }
    change(e) {
        return { prop: this.prop, val: e.val, vue: this };
    }
    get checked() {
        if (this.readOnly)
            return;
        return !!this.doc[this.prop.name];
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropBoolean.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropBoolean.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropBoolean.prototype, "label", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropBoolean.prototype, "readOnly", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('keydown')
], PropBoolean.prototype, "keydown", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropBoolean.prototype, "change", null);
PropBoolean = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropBoolean', components: {} })
], PropBoolean);
exports.default = PropBoolean;
/script>
    < style;
lang = "scss" >
    /style>;
//# sourceMappingURL=PropBoolean.vue.js.map