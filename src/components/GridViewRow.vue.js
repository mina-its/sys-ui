import { __decorate } from "tslib";
import CheckBox from "@/components/CheckBox.vue";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
const main = require('../main');
let GridViewRow = class GridViewRow extends Vue {
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
        return main.getMeta(this.item);
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
    Emit('changed')
], GridViewRow.prototype, "changed", null);
__decorate([
    Emit('headerClick')
], GridViewRow.prototype, "headerClick", null);
__decorate([
    Emit('selected')
], GridViewRow.prototype, "click", null);
__decorate([
    Emit('keydown')
], GridViewRow.prototype, "keydown", null);
GridViewRow = __decorate([
    Component({
        components: { CheckBox }
    })
], GridViewRow);
export default GridViewRow;
//# sourceMappingURL=GridViewRow.vue.js.map