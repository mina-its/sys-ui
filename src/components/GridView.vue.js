"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const bson_util_1 = require("bson-util");
const types_1 = require("@/types");
const main = tslib_1.__importStar(require("../main"));
const types_2 = require("../../../sys/src/types");
let GridView = /** @class */ (() => {
    let GridView = class GridView extends vue_property_decorator_1.Vue {
        constructor() {
            super(...arguments);
            this.rowHeaderStyle = types_2.GridRowHeaderStyle.empty;
            this.mainChecked = false;
            this.filter = null;
            this.filterDoc = {};
            this.filteringProp = null;
            this.filteredProps = [];
            this.headFuncs = [];
        }
        get items() {
            if (this.data) // when we explicitly specify the data
                return this.data;
            else
                return this.$store.state.data[this.uri] || [];
        }
        onUriReset() {
            this.resetFilterParameters();
            this.resetHeadFuncs();
        }
        get showFilter() {
            return this.filter && main_1.glob.form.breadcrumb.length == 0;
        }
        resetFilterParameters() {
            this.filteredProps = [];
            this.filterDoc = {};
            this.filter = { $and: [] };
            this.filteringProp = this.dec.properties[0];
        }
        objectFilterChanged(e) {
            console.log("this.dec.filterData", this.dec.filterData);
            let ref = main_1.setQs(types_2.ReqParams.query, bson_util_1.stringify(this.dec.filterData, true), true);
            ref = main_1.setQs(types_2.ReqParams.page, null, true, ref);
            main_1.load(ref, true);
        }
        resetHeadFuncs() {
            this.headFuncs = [];
            if (this.dec.links) {
                this.headFuncs = this.dec.links.filter(link => !link.disable).map(link => {
                    return { title: link.title, ref: link.address };
                });
            }
        }
        mounted() {
            // console.log("this.items", this.items);
            this.resetHeadFuncs();
            if (!this.dec.filterDec) {
                this.filterDoc = {};
                this.filteringProp = this.dec.properties[0];
                for (let prop of this.dec.properties) {
                    this.filterDoc[prop.name] = null;
                }
                this.extractFilteredProps();
            }
            $('[data-toggle="tooltip"]').tooltip();
        }
        filterValueChanged(e) {
            this.filterDoc[e.prop.name] = e.val;
            let previousFilter = this.filter.$and.find(i => e.prop.name == Object.keys(i.$or[0])[0]);
            if (e.prop.text && e.prop.text.multiLanguage) {
                let filter1 = {};
                filter1[e.prop.name] = e.filterVal;
                let filter2 = {};
                filter2[e.prop.name + "." + main_1.glob.config.locale] = e.filterVal;
                if (previousFilter)
                    previousFilter.$or = [filter1, filter2];
                else
                    this.filter.$and.push({ $or: [filter1, filter2] });
            }
            else {
                let filter = {};
                filter[e.prop.name] = e.filterVal;
                if (previousFilter)
                    previousFilter.$or = [filter];
                else
                    this.filter.$and.push({ $or: [filter] });
            }
            // console.log('filter:', this.filter);
            let props = this.filteredProps;
            let alreadyProp = props.find(prop => prop.name == e.prop.name);
            if (!alreadyProp && e.val != null)
                props.push(e.prop);
            else if (alreadyProp && e.val == null)
                props.splice(props.indexOf(alreadyProp), 1);
            this.filteredProps = null;
            let doc = this.filterDoc;
            this.filterDoc = null;
            this.$nextTick(() => {
                this.filteredProps = [...props];
                this.filterDoc = doc;
            });
            this.refreshQueryByFilter();
        }
        getFilterDocValue(filterVal) {
            if (typeof filterVal == "string" || typeof filterVal == "number")
                return filterVal;
            if (filterVal) {
                if (filterVal instanceof RegExp) {
                    if (/^\/\^/.test(filterVal.toString()))
                        return filterVal.toString().replace(/^\/\^(.+)\/.+/, "$1");
                    else if (/\$\/i?$/.test(filterVal.toString()))
                        return filterVal.toString().replace(/^\/(.+)\$\/.+/, "$1");
                    else
                        return filterVal.toString().replace(/^\/(.+)\/.+/, "$1");
                }
                else if (filterVal.$gt)
                    return filterVal.$gt;
                else if (filterVal.$gte)
                    return filterVal.$gte;
                else if (filterVal.$lt)
                    return filterVal.$lt;
                else if (filterVal.$lte)
                    return filterVal.$lte;
                else if (filterVal.$in)
                    return filterVal.$in;
                else if (filterVal.$ne === true)
                    return types_1.FilterOperator.No;
                else if (filterVal.$ne)
                    return filterVal.$ne;
                else if (filterVal.$nn)
                    return filterVal.$nn;
                else if (filterVal.$none)
                    return filterVal.$none;
                else if (filterVal.$exists)
                    return filterVal.$exists;
                else if (filterVal.$nin)
                    return filterVal.$nin;
            }
            return null;
        }
        extractFilteredProps() {
            this.filteredProps = [];
            if (main_1.getQs(types_2.ReqParams.query))
                this.filter = bson_util_1.parse(main_1.getQs(types_2.ReqParams.query), true, types_1.ID);
            else
                this.filter = { $and: [] };
            if (this.filter.$and) { // $and mode
                for (let item of this.filter.$and) {
                    if (!item.$or) {
                        console.error(`Invalid filter, expected $or`, this.filter);
                        continue;
                    }
                    let key = Object.keys(item.$or[0])[0];
                    let prop = this.dec.properties.find(p => p.name == key.replace(/\..+/, ""));
                    if (prop) {
                        this.filteredProps.push(prop);
                        this.filterDoc[key] = this.getFilterDocValue(item.$or[0][key]);
                    }
                    else
                        console.error(`Property '${key}' not found.`);
                }
            }
            else {
                for (let key in this.filter) {
                    let prop = this.dec.properties.find(p => p.name == key.replace(/\..+/, ""));
                    if (prop) {
                        this.filteredProps.push(prop);
                        this.filterDoc[key] = this.getFilterDocValue(this.filter[key]);
                    }
                    else
                        console.error(`Property '${key}' not found.`);
                }
            }
            // console.log("this.filterDoc", this.filterDoc);
        }
        refreshQueryByFilter() {
            let ref = main_1.setQs(types_2.ReqParams.query, this.filter.$and.length ? bson_util_1.stringify(this.filter, true) : null, true);
            ref = main_1.setQs(types_2.ReqParams.page, null, true, ref);
            main_1.load(ref, true);
        }
        removeFilter(prop) {
            let previousFilter = this.filter.$and.find(i => prop.name == Object.keys(i.$or[0])[0]);
            this.filter.$and.splice(this.filter.$and.indexOf(previousFilter), 1);
            this.filterDoc[prop.name] = null;
            this.filteredProps.splice(this.filteredProps.indexOf(prop), 1);
            this.refreshQueryByFilter();
        }
        changeFilterProp(e) {
            let items = this.dec.properties.map(prop => {
                return { ref: prop, title: prop.title };
            });
            main_1.showCmenu(this, items, e, (state, item) => {
                if (item)
                    state.filteringProp = item.ref;
            });
        }
        clickNewItem() {
            main.load(location.pathname + '?n=1', true);
        }
        clickObjectMenu(e) {
            let items = [
                { ref: "export-excel", title: main_1.$t('export-excel') },
                { ref: "export-csv", title: main_1.$t('export-csv') },
                { ref: "export-pdf", title: main_1.$t('export-pdf') },
                { title: "-" },
                { ref: "import", title: main_1.$t('import') },
                { title: "-" },
                { ref: "email-excel", title: main_1.$t('email-excel') },
                { ref: "email-csv", title: main_1.$t('email-csv') },
                { ref: "email-pdf", title: main_1.$t('email-pdf') },
                { title: "-" },
                { ref: "print", title: main_1.$t('print') },
            ];
            main.showCmenu(null, items, e, (state, item) => {
                switch (item.ref) {
                    case "export-excel":
                        break;
                    case "export-csv":
                        break;
                    case "print":
                        window.print();
                        break;
                }
            });
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
                uri: this.uri + "/" + e.item._id,
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
                    let newItem = { _id: types_1.ID.generateByBrowser(), _new: true, _: { marked: false, dec: this.dec } };
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
                main.load(href, true);
            }
        }
        goForward() {
            if (this.dec.page < this.dec.pages) {
                let href = main.setQs(types_2.ReqParams.page, this.dec.page + 1, true);
                main.load(href, true);
            }
        }
        showColumnMenu(prop, e) {
            let items = [
                { ref: 'sort', title: main_1.$t('sort') },
                { ref: "filter", title: main_1.$t('filter') },
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
                        this.filteringProp = state;
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
            if (e.item._id) {
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
                        let href = main.prepareServerUrl(`${this.dec.ref}/${state._id}`);
                        main.load(href, true);
                        break;
                    }
                    case 'tree': {
                        if (!state._id) {
                            main.notify('ID is expected, please check the item data!', types_2.LogType.Error);
                            console.error(state);
                            return;
                        }
                        let href = main.prepareServerUrl(`${this.dec.ref}/${state._id}?t=${types_2.ObjectViewType.TreeView}`);
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
    ], GridView.prototype, "data", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], GridView.prototype, "dec", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], GridView.prototype, "newItem", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], GridView.prototype, "level", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Watch('uri') // Switching between forms
    ], GridView.prototype, "onUriReset", null);
    GridView = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'GridView', components: {} })
    ], GridView);
    return GridView;
})();
exports.default = GridView;
//# sourceMappingURL=GridView.vue.js.map