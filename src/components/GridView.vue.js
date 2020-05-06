"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const types_1 = require("@/types");
const uuid_1 = require("uuid");
const main = tslib_1.__importStar(require("../main"));
const types_2 = require("../../../sys/src/types");
let GridView = class GridView extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.rowHeaderStyle = types_2.GridRowHeaderStyle.empty;
        this.mainChecked = false;
    }
    get items() {
        return this.$store.state.data[this.uri] || [];
    }
    mainCheckChange(e) {
        this.mainChecked = e.val;
        if (e.val)
            this.selectAll();
        else {
            this.rowHeaderStyle = types_2.GridRowHeaderStyle.empty;
            this.deselectAll();
        }
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
    keydown(e) {
        if (!e || !e.event)
            return;
        switch (e.event.which) {
            case types_2.Keys.esc:
                break;
            case types_2.Keys.up:
            case types_2.Keys.down:
            case types_2.Keys.enter:
                let $t = $(e.event.target);
                let ci = $t.closest('td')[0].cellIndex;
                let ri = $t.closest('tr')[0].rowIndex + (e.event.which == types_2.Keys.up ? -1 : 1);
                let table = $t.closest('table');
                if (e.event.which == types_2.Keys.enter && ri == table[0].rows.length - 1)
                    this.insert();
                else if (ri <= 0 || ri >= table[0].rows.length - 1)
                    return;
                setTimeout(() => {
                    let row = table[0].rows[ri];
                    let cell = row.cells[ci].firstChild;
                    row.click();
                    cell.focus();
                }, 0);
                if (e.event.ctrlKey) {
                    if (e.event.which == types_2.Keys.up)
                        this.rowMove(true, this.uri);
                    if (e.event.which == types_2.Keys.down)
                        this.rowMove(false, this.uri);
                }
                break;
        }
    }
    insert() {
        switch (this.dec.newItemMode) {
            case types_2.NewItemMode.newPage:
                main.load(location.pathname + '?n=1', true);
                break;
            default:
                if (main_1.getQs(types_1.Constants.QUERY_NEW)) {
                    main_1.notify("Please save your changes before!", types_2.LogType.Warning);
                    return;
                }
                let newItem = { _id: uuid_1.v4(), _: { marked: false, dec: this.dec } };
                this.dec.properties.forEach(prop => newItem[prop.name] = null);
                if (this.dec.reorderable)
                    newItem['_z'] = (Math.max(...this.items.map(item => item._z)) || 0) + 1;
                main.dispatchStoreModify(this, {
                    type: types_1.ChangeType.InsertItem, item: newItem, uri: this.uri, vue: this
                });
                break;
            case types_2.NewItemMode.modal:
                main.notify('not supported!', types_2.LogType.Error);
                break;
        }
    }
    goBack() {
        if (this.dec.page > 1) {
            let href = main.setQs(types_2.ReqParams.page, this.dec.page - 1, true);
            main.load(href);
        }
    }
    goForward() {
        if (this.dec.page < this.dec.pages) {
            let href = main.setQs(types_2.ReqParams.page, this.dec.page + 1, true);
            main.load(href);
        }
    }
    showColumnMenu(prop, e) {
        let items = [
            { ref: 'sort', title: main_1.$t('sort') },
        ];
        main.showCmenu(prop, items, e, (state, item) => {
            main.hideCmenu();
            if (!item)
                return;
            switch (item.ref) {
                case 'sort':
                    let prevSort = main.getQs(types_2.ReqParams.sort);
                    let sort = (prevSort && prevSort.indexOf('-') == -1 ? '-' : '') + state.name;
                    let href = main.setQs(types_2.ReqParams.sort, sort, true);
                    main.load(href, true);
                    break;
                case 'filter':
                    // this.meta.filter.items.push({title: state.title, id: Math.random()});
                    break;
            }
        });
    }
    deleteItems() {
        let selectedItems = this.items.filter(item => item._.marked);
        for (let item of selectedItems) {
            main.dispatchStoreModify(this, {
                type: types_1.ChangeType.DeleteItem,
                uri: this.dec.ref,
                item,
                vue: this
            });
        }
        this.rowHeaderStyle = types_2.GridRowHeaderStyle.empty;
    }
    onScroll() {
        main.hideCmenu();
    }
    selectAll() {
        this.rowHeaderStyle = types_2.GridRowHeaderStyle.select;
        this.items.forEach(item => item._.marked = true);
    }
    deselectAll(but) {
        this.items.forEach(item => item._.marked = false);
        if (but)
            but._.marked = true;
    }
    rowSelected(e) {
        this.mainChecked = false;
        if (this.rowHeaderStyle == types_2.GridRowHeaderStyle.select) {
            e.item._.marked = !e.item._.marked;
            if (!this.items.find(item => item._.marked))
                this.rowHeaderStyle = types_2.GridRowHeaderStyle.empty;
        }
        else
            this.deselectAll(e.item);
    }
    showRowMenu(e) {
        let items = [
            { ref: 'select', title: main_1.$t('select') },
            { ref: 'select-all', title: main_1.$t('select-all') },
            { ref: null, title: '-' },
            { ref: 'delete', title: main_1.$t('delete') },
        ];
        if (e.item._id && main.getBsonId(e.item)) {
            items.unshift({ ref: 'details', title: main_1.$t('details') });
        }
        if (this.dec.reorderable) {
            items.push({ ref: null, title: '-' });
            items.push({ ref: 'move-up', title: main_1.$t('row-move-up') });
            items.push({ ref: 'move-down', title: main_1.$t('row-move-down') });
        }
        main.showCmenu(e.item, items, e.event, (state, item) => {
            main.hideCmenu();
            if (!item)
                return;
            switch (item.ref) {
                case 'delete':
                    this.deleteItems();
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
                case 'tree': {
                    if (!state._id) {
                        main.notify('ID is expected, please check the item data!', types_2.LogType.Error);
                        console.error(state);
                        return;
                    }
                    let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}?t=${types_2.ObjectViewType.TreeView}`);
                    main.load(href, true);
                    break;
                }
                case 'select':
                    this.rowHeaderStyle = types_2.GridRowHeaderStyle.select;
                    break;
                case 'select-all':
                    this.selectAll();
                    break;
                case 'move-up':
                    this.rowMove(true, this.uri);
                    break;
                case 'move-down':
                    this.rowMove(false, this.uri);
                    break;
            }
        });
        this.deselectAll(e.item);
    }
    rowMove(up, uri) {
        let item = this.items.find(item => item._.marked);
        main.commitReorderItems(this.$store, this.items, up, uri, item);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridView.prototype, "uri", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridView.prototype, "root", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridView.prototype, "dec", void 0);
GridView = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        name: 'GridView',
        components: {}
    })
], GridView);
exports.default = GridView;
//# sourceMappingURL=GridView.vue.js.map