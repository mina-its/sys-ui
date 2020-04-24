<template>
    <div :class="'grid-view' + (root?' p-4':'')" @scroll="onScroll()">
        <!--        <div v-if="dec.filter && dec.filter.items" class="p-2 btn-toolbar">-->
        <!--            <filter-item :item="item" :key="item.id" v-for="item in dec.filter.items" :dec="dec"></filter-item>-->
        <!--        </div>-->
        <table :class="{'table table-sm':true, 'table-box':root}">
            <thead>
            <tr>
                <th scope="col" v-if="rowHeaderStyle===2" class="text-center">
                    <CheckBox :checked="mainChecked" @changed="mainCheckChange"></CheckBox>
                </th>
                <th scope="col" v-else></th>
                <th scope="col" class="text-nowrap" @click="showColumnMenu(prop, $event)"
                    v-for="prop in dec.properties">
                    {{prop.title || prop.name}}
                </th>
            </tr>
            </thead>
            <tbody>
            <GridViewRow @selected="rowSelected" :selectable="rowHeaderStyle===2" @keydown="keydown"
                         @headerClick="showRowMenu" v-for="item in items" :item="item"
                         @changed="changed"></GridViewRow>
            </tbody>
            <tfoot>
            <tr>
                <td class="border-0" colspan="100">
                    <div class="align-items-center d-flex">
                        <function styles="m-2 fa-plus" @exec="insert" name="newItem" :title="$t('add')"></function>
                        <function v-if="rowHeaderStyle===2" styles="fa-trash" @exec="deleteItems" name="deleteItems"
                                  :title="$t('delete')"></function>
                        <ul v-if="dec.pages > 1" class="m-2 pagination flex-grow-1">
                            <li class="page-item"><a @click="goBack" href="javascript:;" class="page-link"><i
                                    class="fa fa-chevron-left"></i></a></li>
                            <li v-for="page in dec.pageLinks" :class="'page-item' + (page.active ? ' active':'') "><a
                                    class="page-link" :href="page.ref">{{page.title}}</a></li>
                            <li class="page-item"><a href="javascript:;" class="page-link" @click="goForward"><i
                                    class="fa fa-chevron-right"></i></a></li>
                        </ul>
                    </div>
                </td>
            </tr>
            </tfoot>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {$t, glob} from '@/main';
    import {ItemEventArg, ItemChangeEventArg, MenuItem, StateChange, ChangeType, JQuery} from '@/types';
    import GridViewRow from "@/components/GridViewRow.vue";
    import FilterItem from "@/components/FilterItem.vue";
    import {v4 as uuidv4} from 'uuid';

    declare let $: JQuery;
    import * as main from '../main';
    import {
        EntityMeta,
        GridRowHeaderStyle,
        Keys,
        LogType,
        NewItemMode,
        ObjectDec,
        ObjectViewType,
        Pair,
        ReqParams,
        IData
    } from '../../../sys/src/types';
    import CheckBox from "@/components/CheckBox.vue";

    @Component({
        components: {CheckBox, GridViewRow, FilterItem}
    })
    export default class GridView extends Vue {
        @Prop() private uri: string;
        @Prop() private root: boolean;
        @Prop() private dec: ObjectDec;

        private rowHeaderStyle = GridRowHeaderStyle.empty;
        private mainChecked = false;

        get items(): IData[] {
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

        changed(e: ItemChangeEventArg) {
            main.dispatchStoreModify(this, {
                type: ChangeType.EditProp,
                prop: e.prop,
                value: e.val,
                item: e.item,
                uri: this.uri + "/" + main.getBsonId(e.item),
                vue: e.vue
            } as StateChange);
        }

        keydown(e: ItemEventArg) {
            if (!e || !e.event) return;
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
                            this.rowMove(true, this.uri);

                        if (e.event.which == Keys.down)
                            this.rowMove(false, this.uri);
                    }

                    break;
            }
        }

        insert() {
            switch (this.dec.newItemMode) {
                case NewItemMode.newPage:
                    main.load(location.pathname + '?n=1', true);
                    break;

                default:
                    let newItem = {_id: uuidv4(), _: {marked: false, dec: this.dec} as EntityMeta};
                    this.dec.properties.forEach(prop => newItem[prop.name] = null);
                    if (this.dec.reorderable)
                        newItem['_z'] = (Math.max(...this.items.map(item => item._z)) || 0) + 1;

                    main.dispatchStoreModify(this, {
                        type: ChangeType.InsertItem, item: newItem, uri: this.uri, vue: this
                    } as StateChange);
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
            let items: MenuItem[] = [
                {ref: 'sort', title: $t('sort')},
                // {ref: "filter", title: $t('filter')},
            ];
            main.showCmenu(prop, items, e, (state, item: MenuItem) => {
                main.hideCmenu();
                if (!item)
                    return;

                switch (item.ref) {
                    case 'sort':
                        let prevSort = main.getQs(ReqParams.sort);
                        let sort = (prevSort && prevSort.indexOf('-') == -1 ? '-' : '') + state.name;
                        let href = main.setQs(ReqParams.sort, sort, true);
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
                    type: ChangeType.DeleteItem,
                    uri: this.dec.ref,
                    item,
                    vue: this
                } as StateChange);
            }
            this.rowHeaderStyle = GridRowHeaderStyle.empty;
        }

        onScroll() {
            main.hideCmenu();
        }

        selectAll() {
            this.rowHeaderStyle = GridRowHeaderStyle.select;
            this.items.forEach(item => item._.marked = true);
        }

        deselectAll(but?: IData) {
            this.items.forEach(item => item._.marked = false);
            if (but)
                but._.marked = true;
        }

        rowSelected(e: ItemEventArg) {
            this.mainChecked = false;
            if (this.rowHeaderStyle == GridRowHeaderStyle.select) {
                e.item._.marked = !e.item._.marked;
                if (!this.items.find(item => item._.marked))
                    this.rowHeaderStyle = GridRowHeaderStyle.empty;
            } else
                this.deselectAll(e.item);
        }

        showRowMenu(e: ItemEventArg) {
            let items: Pair[] = [
                {ref: 'select', title: $t('select')},
                {ref: 'select-all', title: $t('select-all')},
                {ref: null, title: '-'},
                {ref: 'delete', title: $t('delete')},
            ];

            if (e.item._id && main.getBsonId(e.item)) {
                if (this.root)
                    items.unshift({ref: 'tree', title: $t('tree-view')});
                items.unshift({ref: 'details', title: $t('details')});
            }

            if (this.dec.reorderable) {
                items.push({ref: null, title: '-'});
                items.push({ref: 'move-up', title: $t('row-move-up')});
                items.push({ref: 'move-down', title: $t('row-move-down')});
            }

            main.showCmenu(e.item, items, e.event, (state, item: MenuItem) => {
                main.hideCmenu();
                if (!item) return;
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
                        main.load(href, true);
                        break;
                    }

                    case 'tree': {
                        if (!state._id) {
                            main.notify('ID is expected, please check the item data!', LogType.Error);
                            console.error(state);
                            return;
                        }
                        let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}?t=${ObjectViewType.TreeView}`);
                        main.load(href, true);
                        break;
                    }

                    case 'select':
                        this.rowHeaderStyle = GridRowHeaderStyle.select;
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

        rowMove(up: boolean, uri: string) {
            console.log(1);
            main.commitReorderItems(this.$store, this.items, up, uri);
        }
    }
</script>

<style lang="scss">
    $left: var(--left);
    $right: var(--right);

    .grid-view {

        table {
            background: #fff;
            /*color: rgba(0, 0, 0, 0.54);*/
        }

        .table-box {
            border-radius: 2px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        }

        td, th {
            border: 1px solid var(--grid-border);
            // border-left: none;
        }

        td:last-child, th:last-child {
            // border-right: none;
        }

        th {
            background-color: var(--grid-head);

            &:first-child {
                min-width: 3rem;
            }
        }

        input {
            border: none;
            background-color: transparent;
            outline: none;
        }

        .filter-item {
            cursor: pointer;
            margin-#{$right}: var(--badge-padding-x);
            font-size: var(--font-size-base);
            font-weight: normal;

            &:hover {
                opacity: .9;
            }
        }

        .page-item {
            &:last-child .page-link {
                border-top-#{$right}-radius: 0.25rem;
                border-bottom-#{$right}-radius: 0.25rem;
                border-top-#{$left}-radius: inherit;
                border-bottom-#{$left}-radius: inherit;
            }

            &:first-child .page-link {
                margin-#{$left}: 0;
                border-top-#{$left}-radius: 0.25rem;
                border-bottom-#{$left}-radius: 0.25rem;
                border-top-#{$right}-radius: inherit;
                border-bottom-#{$right}-radius: inherit;
            }
        }
    }
</style>
