import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
let GridViewRow = class GridViewRow extends Vue {
    focused(e, prop) {
        $(".prop-focused").removeClass("prop-focused");
        $(e.target).closest("td").addClass("prop-focused");
    }
    changed(prop, val) {
        //this.$emit('changed', prop, val);
        return { prop, val };
    }
    updateStatus() {
        this.meta.marked = event.target.checked;
    }
    headerClick(item, $event) {
        this.$emit('headerClick', item, $event);
    }
    click() {
        this.$emit('selected', this.item);
    }
    keydown(e, prop) {
        this.$emit('keydown', e, this.item, prop);
    }
    get meta() {
        return this.item._;
    }
};
__decorate([
    Prop()
], GridViewRow.prototype, "item", void 0);
__decorate([
    Prop()
], GridViewRow.prototype, "selectable", void 0);
__decorate([
    Prop()
], GridViewRow.prototype, "dec", void 0);
__decorate([
    Emit()
], GridViewRow.prototype, "changed", null);
GridViewRow = __decorate([
    Component
], GridViewRow);
export default GridViewRow;
//# sourceMappingURL=GridViewRow.vue.js.map