"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
let GridViewRow = class GridViewRow extends vue_property_decorator_1.Vue {
    focused(e, prop) {
        $(".prop-focused").removeClass("prop-focused");
        $(e.target).closest("td").addClass("prop-focused");
    }
    changed(e) {
        return e;
    }
    updateStatus() {
        this.meta.marked = event.target.checked;
    }
    headerClick(e) {
        return { item: this.item, event: e };
    }
    click(e) {
        return { item: this.item, event: e };
    }
    keydown(e) {
        return { event: e.event, item: this.item, prop: e.prop };
    }
    get meta() {
        return this.item._;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridViewRow.prototype, "item", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridViewRow.prototype, "selectable", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridViewRow.prototype, "readonly", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], GridViewRow.prototype, "changed", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('headerClick')
], GridViewRow.prototype, "headerClick", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('selected')
], GridViewRow.prototype, "click", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('keydown')
], GridViewRow.prototype, "keydown", null);
GridViewRow = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'GridViewRow', components: {} })
], GridViewRow);
exports.default = GridViewRow;
//# sourceMappingURL=GridViewRow.vue.js.map