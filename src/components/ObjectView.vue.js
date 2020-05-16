"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main_1 = require("@/main");
const pluralize = require("pluralize");
let ObjectView = class ObjectView extends vue_property_decorator_1.Vue {
    render(ce) {
        let e = this.elem;
        if (!e.obj) {
            console.error("Element 'object-view' needs obj property.", e);
            ce('div', '...');
            return;
        }
        let data = this.$store.state.data[e.obj._.ref];
        const dec = main_1.glob.form.declarations[e.obj._.ref];
        if (!dec)
            throw `dec is empty for ref '${e.obj._.ref}'`;
        let root = this.root == null ? true : this.root;
        if (Array.isArray(data)) {
            let viewType = dec.listsViewType || types_1.ObjectListsViewType.Grid;
            let newItem = (dec.access & types_1.AccessPermission.NewItem) &&
                Array.isArray(data) && dec.newItemMode == types_1.NewItemMode.newPage ? "New " + pluralize.singular(main_1.glob.form.title) : null;
            let props = { uri: e.obj._.ref, root, dec, newItem };
            switch (viewType) {
                default:
                case types_1.ObjectListsViewType.Grid:
                    return ce('grid-view', { props });
                case types_1.ObjectListsViewType.Card:
                    return ce('card-view', { props });
            }
        }
        else {
            let viewType = dec.detailsViewType || types_1.ObjectDetailsViewType.Tabular;
            if (viewType === types_1.ObjectDetailsViewType.Tree)
                return ce('tree-view', { props: { uri: e.obj._.ref } });
            else
                return ce('details-view', { props: { uri: e.obj._.ref, root: root, dec } });
        }
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], ObjectView.prototype, "elem", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], ObjectView.prototype, "root", void 0);
ObjectView = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'ObjectView' })
], ObjectView);
exports.default = ObjectView;
//# sourceMappingURL=ObjectView.vue.js.map