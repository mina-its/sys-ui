"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
;
let PropTextMultiline = class PropTextMultiline extends vue_property_decorator_1.Vue {
    update(e) {
        let val = e.target.value;
        if (val === "")
            val = null;
        return { prop: this.prop, val, vue: this };
    }
    focus(e) {
        return { prop: this.prop, event: e };
    }
    get value() {
        return this.doc[this.prop.name];
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTextMultiline.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTextMultiline.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropTextMultiline.prototype, "update", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('focus')
], PropTextMultiline.prototype, "focus", null);
PropTextMultiline = tslib_1.__decorate([
    vue_property_decorator_1.Component
], PropTextMultiline);
exports.default = PropTextMultiline;
//# sourceMappingURL=PropTextMultiline.vue.js.map