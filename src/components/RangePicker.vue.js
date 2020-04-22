"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
let RangePicker = class RangePicker extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.menuVisible = false;
    }
    showMenu() {
        this.menuVisible = true;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RangePicker.prototype, "pair", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RangePicker.prototype, "value", void 0);
RangePicker = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: {} })
], RangePicker);
exports.default = RangePicker;
//# sourceMappingURL=RangePicker.vue.js.map