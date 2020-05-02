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
        let data = this.$store.state.data[e.obj.ref];
        // if (!data) data = this.$store.state.data[e.obj.ref] = {};
        const dec = main_1.glob.form.declarations[e.obj.ref];
        if (!dec)
            throw `dec is empty for ref '${e.obj.ref}'`;
        main_1.glob.form.toolbar = true;
        let rt = this.root == null ? true : this.root;
        main_1.glob.newItemButton = Array.isArray(data) && dec.newItemMode == types_1.NewItemMode.newPage ? "New " + pluralize.singular(main_1.glob.form.title) : null;
        if (Array.isArray(data)) {
            let viewType = dec.listsViewType || types_1.ObjectListsViewType.Grid;
            switch (viewType) {
                default:
                case types_1.ObjectListsViewType.Grid:
                    return ce('grid-view', { props: { uri: e.obj.ref, root: rt, dec } });
                case types_1.ObjectListsViewType.Card:
                    return ce('card-view', { props: { uri: e.obj.ref, root: rt, dec } });
            }
        }
        else {
            let viewType = dec.detailsViewType || types_1.ObjectDetailsViewType.Tabular;
            if (viewType === types_1.ObjectDetailsViewType.Tree)
                return ce('tree-view', { props: { uri: e.obj.ref } });
            else
                return ce('details-view', { props: { uri: e.obj.ref, root: rt, dec } });
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