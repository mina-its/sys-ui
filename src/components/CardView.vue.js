"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_2 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
const Prop_vue_1 = tslib_1.__importDefault(require("@/components/Prop.vue"));
let CardView = class CardView extends vue_property_decorator_1.Vue {
    get items() {
        let _items = this.$store.state.data[this.uri] || [];
        if (this.dec.reorderable)
            main.sort(_items, "_z");
        return _items;
    }
    created() {
        main_1.glob.cmenu;
    }
    clickMenu(e, item) {
        let items = [
            { ref: 'details', title: main_1.$t('details') },
            { ref: null, title: '-' },
            { ref: 'delete', title: main_1.$t('delete') },
        ];
        if (this.dec.reorderable) {
            items.push({ ref: null, title: '-' });
            items.push({ ref: 'move-up', title: main_1.$t('row-move-up') });
            items.push({ ref: 'move-down', title: main_1.$t('row-move-down') });
        }
        main_1.showCmenu(item, items, e, (state, item) => {
            if (!item)
                return;
            switch (item.ref) {
                case 'delete':
                    main.dispatchStoreModify(this, {
                        type: types_1.ChangeType.DeleteItem,
                        uri: this.dec.ref,
                        item: state,
                        vue: this
                    });
                    break;
                case 'details': {
                    if (!state._id) {
                        main.notify('ID is expected, please check the item data!', types_2.LogType.Error);
                        console.error(state);
                        return;
                    }
                    let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}`);
                    main.load(href, true);
                    break;
                }
                case 'move-up':
                    main.commitReorderItems(this.$store, this.items, true, this.uri, state);
                    break;
                case 'move-down':
                    main.commitReorderItems(this.$store, this.items, false, this.uri, state);
                    break;
            }
        });
    }
    getTitle(item) {
        return main_1.$t(item["title"]);
    }
    changed(e) {
        main.dispatchStoreModify(this, {
            type: types_1.ChangeType.EditProp,
            prop: e.prop,
            value: e.val,
            item: e.item,
            uri: this.uri + "/" + main.getBsonId(e.item),
            vue: e.vue
        });
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], CardView.prototype, "uri", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], CardView.prototype, "root", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], CardView.prototype, "dec", void 0);
CardView = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'CardView', components: { Prop: Prop_vue_1.default } })
], CardView);
exports.default = CardView;
//# sourceMappingURL=CardView.vue.js.map