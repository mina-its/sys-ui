"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
let RollPicker = class RollPicker extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.itemHeight = 50;
        this.scrollTop = 0;
    }
    mounted() {
        this.$refs.sc.scrollTop = this.index * this.itemHeight;
        $(this.$refs.sc).css("scroll-behavior", "smooth");
    }
    itemStyle(index, level) {
        let offset = index - Math.round(this.scrollTop / this.itemHeight);
        return level == Math.abs(offset);
    }
    click(index) {
        this.$refs.sc.scrollTop = index * this.itemHeight;
    }
    change(index) {
        return { index, item: this.items[index] };
    }
    scroll() {
        this.scrollTop = this.$refs.sc.scrollTop;
        let index = Math.round(this.scrollTop / this.itemHeight);
        if (this.index != index)
            this.change(index);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RollPicker.prototype, "items", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RollPicker.prototype, "index", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RollPicker.prototype, "caption", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], RollPicker.prototype, "change", null);
RollPicker = tslib_1.__decorate([
    vue_property_decorator_1.Component
], RollPicker);
exports.default = RollPicker;
//# sourceMappingURL=RollPicker.vue.js.map