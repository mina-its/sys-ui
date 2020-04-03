import { __decorate } from "tslib";
import FilterItem from "@/components/FilterItem.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { GridRowHeaderStyle, Keys, LogType, NewItemMode, ObjectViewType, ReqParams } from '../../../sys/src/types';
import { $t, glob } from '@/main';
import { StateChangeType } from '@/types';
import GridViewRow from "@/components/GridViewRow.vue";
import CheckBox from "@/components/CheckBox.vue";
import { v4 as uuidv4 } from 'uuid';
const $ = require('jquery');
const main = require('@/main');
let GridView = class GridView extends Vue {
    constructor() {
        super(...arguments);
        this.rowHeaderStyle = GridRowHeaderStyle.empty;
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
            this.rowHeaderStyle = GridRowHeaderStyle.empty;
            this.deselectAll();
        }
    }
    changed(e) {
        main.dispatchStoreModify(this, {
            type: StateChangeType.Patch,
            prop: e.prop,
            value: e.val,
            item: e.item,
            uri: this.uri + "/" + main.getBsonId(e.item),
            vue: e.vue
        });
    }
    keydown(e) {
        switch (e.event.which) {
            case Keys.esc:
                break;
            case Keys.up:
            case Keys.down:
            case Keys.enter:
                let $t = $(e.event.target);
                let ci = $t.closest('td')[0].cellIndex;
                let ri = $t.closest('tr')[0].rowIndex + (e.event.which == Keys.up ? -1 : 1);
                let table = $t.closest('table');
                if (e.event.which == Keys.enter && ri == table[0].rows.length - 1)
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
                    if (e.event.which == Keys.up)
                        this.rowMove(true);
                    if (e.event.which == Keys.down)
                        this.rowMove(false);
                }
                break;
        }
    }
    insert() {
        switch (this.dec.newItemMode) {
            case NewItemMode.newPage:
                history.pushState(null, null, location.pathname + '?n=true');
                main.load(location.pathname + '?n=true');
                break;
            default:
                let newItem = { _id: uuidv4(), _: { marked: false, dec: this.dec } };
                this.dec.properties.forEach(prop => newItem[prop.name] = null);
                if (this.dec.reorderable)
                    newItem['_z'] = (Math.max(...this.items.map(item => item._z)) || 0) + 1;
                main.dispatchStoreModify(this, {
                    type: StateChangeType.Insert, item: newItem, uri: this.uri, vue: this
                });
                break;
            case NewItemMode.modal:
                main.notify('not supported!', LogType.Error);
                break;
        }
    }
    goBack() {
        if (this.dec.page > 1) {
            let href = main.setQs(ReqParams.page, this.dec.page - 1, true);
            main.load(href);
        }
    }
    goForward() {
        if (this.dec.page < this.dec.pages) {
            let href = main.setQs(ReqParams.page, this.dec.page + 1, true);
            main.load(href);
        }
    }
    showColumnMenu(prop, e) {
        let items = [
            { ref: 'sort', title: $t('sort') },
        ];
        main.showCmenu(prop, items, e, (state, item) => {
            main.hideCmenu();
            if (!item)
                return;
            switch (item.uri) {
                case 'sort':
                    let prevSort = main.getQs(ReqParams.sort);
                    let sort = (prevSort && prevSort.indexOf('-') == -1 ? '-' : '') + state.name;
                    let href = main.setQs(ReqParams.sort, sort, true);
                    history.pushState(null, null, href);
                    main.load(href);
                    break;
                case 'filter':
                    // this.meta.filter.items.push({title: state.title, id: Math.random()});
                    break;
            }
        });
    }
    deleteItems() {
        let selectedItems = this.items.filter(item => main.getMeta(item).marked);
        for (let item of selectedItems) {
            main.dispatchStoreModify(this, {
                type: StateChangeType.Delete,
                uri: this.dec.ref,
                item,
                vue: this
            });
        }
        this.rowHeaderStyle = GridRowHeaderStyle.empty;
    }
    onScroll() {
        main.hideCmenu();
    }
    selectAll() {
        this.rowHeaderStyle = GridRowHeaderStyle.select;
        this.items.forEach(item => main.getMeta(item).marked = true);
    }
    deselectAll(but) {
        this.items.forEach(item => main.getMeta(item).marked = false);
        if (but)
            main.getMeta(but).marked = true;
    }
    rowSelected(e) {
        this.mainChecked = false;
        let meta = main.getMeta(e.item);
        if (this.rowHeaderStyle == GridRowHeaderStyle.select)
            meta.marked = !meta.marked;
        else
            this.deselectAll(e.item);
    }
    showRowMenu(e) {
        let items = [
            { ref: 'select', title: $t('select') },
            { ref: 'select-all', title: $t('select-all') },
            { ref: null, title: '-' },
            { ref: 'delete', title: $t('delete') },
        ];
        if (e.item._id && main.getBsonId(e.item)) {
            if (this.root)
                items.unshift({ ref: 'tree', title: $t('tree-view') });
            items.unshift({ ref: 'details', title: $t('details') });
        }
        if (this.dec.reorderable) {
            items.push({ ref: null, title: '-' });
            items.push({ ref: 'move-up', title: $t('row-move-up') });
            items.push({ ref: 'move-down', title: $t('row-move-down') });
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
                        main.notify('ID is expected, please check the item data!', LogType.Error);
                        console.error(state);
                        return;
                    }
                    let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}`);
                    history.pushState(null, null, href);
                    main.load(href);
                    break;
                }
                case 'tree': {
                    if (!state._id) {
                        main.notify('ID is expected, please check the item data!', LogType.Error);
                        console.error(state);
                        return;
                    }
                    let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}?t=${ObjectViewType.TreeView}`);
                    history.pushState(null, null, href);
                    main.load(href);
                    break;
                }
                case 'select':
                    this.rowHeaderStyle = GridRowHeaderStyle.select;
                    break;
                case 'select-all':
                    this.selectAll();
                    break;
                case 'move-up':
                    this.rowMove(true);
                    break;
                case 'move-down':
                    this.rowMove(false);
                    break;
            }
        });
        this.deselectAll(e.item);
    }
    rowMove(up) {
        let item = this.items.find(item => main.getMeta(item).marked);
        let index = this.items.indexOf(item);
        if ((up && index == 0) || (!up && index == this.items.length - 1))
            return;
        glob.dirty = true;
        let emptyZs = this.items.filter(item => !item._z);
        if (emptyZs.length) {
            let min = Math.min(...this.items.map(item => item._z)) || 0;
            this.items.forEach(item => item._z = ++min);
        }
        let siblingIndex = up ? index - 1 : index + 1;
        let sibling = this.items[siblingIndex];
        // check if _z are same (happens in some situations)
        if (item._z == sibling._z) {
            let min = Math.min(...this.items.map((item) => item._z));
            this.items.forEach(item => item._z = min++);
        }
        // replace items _z
        let _z = item._z;
        item._z = sibling._z;
        sibling._z = _z;
        // reorder items index for UI effect
        this.items.splice(index, 1);
        this.items.splice(siblingIndex, 0, item);
    }
};
__decorate([
    Prop()
], GridView.prototype, "uri", void 0);
__decorate([
    Prop()
], GridView.prototype, "root", void 0);
__decorate([
    Prop()
], GridView.prototype, "dec", void 0);
GridView = __decorate([
    Component({
        components: { CheckBox, GridViewRow, FilterItem }
    })
], GridView);
export default GridView;
//# sourceMappingURL=GridView.vue.js.map