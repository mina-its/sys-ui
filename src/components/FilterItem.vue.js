import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let FilterItem = class FilterItem extends Vue {
    close() {
        // this.meta.filter.items = this.meta.filter.items.filter(item => {
        // 	return item.id !== this.item.id;
        // });
    }
};
__decorate([
    Prop()
], FilterItem.prototype, "item", void 0);
__decorate([
    Prop()
], FilterItem.prototype, "meta", void 0);
FilterItem = __decorate([
    Component
], FilterItem);
export default FilterItem;
//# sourceMappingURL=FilterItem.vue.js.map