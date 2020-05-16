<template>
    <div :class="{'main-body h-100 d-flex flex-column flex-fill overflow-auto':1, 'root': root}">
        <!-- Toolbar -->
        <div v-if="root" :class="{'d-flex p-2 btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">
            <Breadcrumb :count="dec.count"/>

            <ToolbarModifyButtons/>

            <!-- Filter -->
            <div v-if="root && filter && filteringProp" class="filter-chip border d-flex py-0 align-items-center px-2 bg-white mx-5 rounded">
                <PropertyFilter :allowPropChange="true" @changed="filterValueChanged" @changeFilterProp="changeFilterProp" :prop="filteringProp" :filter="filter" :filterDoc="filterDoc"/>
                <i class="fal fa-filter p-1 d-inline-block text-muted"></i>
            </div>

            <div class="mr-auto"></div>

            <template v-for="func in headFuncs">
                <a :href="func.ref" :class="`${func.style||'btn btn-success mx-1 px-2'}`" v-if="func.ref">{{func.title}}</a>
                <Function v-else styles="btn-primary mx-1" :name="func.name" @exec="func.exec" :title="func.title"/>
            </template>
            <button v-if="newItem" class="btn btn-success mx-1" @click="clickNewItem"><i class="fal fa-plus-circle pr-2"></i>{{newItem}}</button>
            <Function styles="text-secondary fal fa-cog fa-lg" name="clickTitlePin" @exec="clickTitlePin"></Function>
        </div>

        <!-- Table -->
        <div class="w-100 h-100 overflow-auto d-flex">
            <div :class="{'grid-view':true, 'p-4':root}" @scroll="onScroll()">

                <!-- Filter Items -->
                <div v-if="filter && filteringProp && filteredProps.length" class="pb-2 d-flex">
                    <div v-for="prop of filteredProps" class="filter-chip border d-flex align-items-center py-1 px-2 bg-white mr-2">
                        <PropertyFilter :allowPropChange="false" :prop="prop" :filter="filter" @changed="filterValueChanged" :filterDoc="filterDoc"/>
                        <i @click="removeFilter(prop)" class="fas fa-times p-1 text-dark"></i>
                    </div>
                </div>

                <!-- Grid View -->
                <table :class="{'grid-view-box mb-5':root}">
                    <thead>
                    <tr>
                        <th scope="col" v-if="rowHeaderStyle===2" class="text-center">
                            <CheckBox :checked="mainChecked" @changed="mainCheckChange"></CheckBox>
                        </th>
                        <th scope="col" v-else></th>
                        <th scope="col" class="text-nowrap" @click="showColumnMenu(prop, $event)" v-for="prop in dec.properties"> {{prop.title || prop.name}}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <GridViewRow @selected="rowSelected" :selectable="rowHeaderStyle===2" @keydown="keydown" @headerClick="showRowMenu" v-for="item in items" :item="item" :readonly="!(dec.access&2)" @changed="changed"></GridViewRow>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td class="border-0" colspan="100">
                            <div class="align-items-center d-flex">
                                <Function v-if="dec.access & 4" styles="m-1 fal fa-plus-circle" @exec="insert" name="newItem" :title="$t('add')"></Function>
                                <Function v-if="rowHeaderStyle===2" styles="fas fa-trash" @exec="deleteItems" name="deleteItems" :title="$t('delete')"></Function>
                                <div class="flex-grow-1 d-flex align-items-center">
                                    <ul v-if="dec.pages > 1" class="m-2 pagination ">
                                        <li class="page-item">
                                            <a @click="goBack" href="javascript:;" class="page-link"> <i :class="{'fa':1,'fa-chevron-right':rtl,'fa fa-chevron-left':ltr}"></i> </a>
                                        </li>
                                        <li v-for="page in dec.pageLinks" :class="'page-item' + (page.active ? ' active':'') ">
                                            <a class="page-link" :href="page.ref">{{page.title}}</a></li>
                                        <li class="page-item">
                                            <a href="javascript:;" class="page-link" @click="goForward"> <i :class="{'fa':1,'fa-chevron-left':rtl,'fa fa-chevron-right':ltr}"></i> </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {$t, getQs, glob, load, notify, setQs, showCmenu} from '@/main';
    import {ChangeType, Constants, FilterChangeEventArg, FilterOperator, FunctionExecEventArg, HeadFunc, ItemChangeEventArg, ItemEventArg, JQuery, MenuItem, StateChange} from '@/types';
    import {v4 as uuidv4} from 'uuid';
    import * as main from '../main';
    import {EntityMeta, GridRowHeaderStyle, IData, Keys, LogType, NewItemMode, ObjectDec, ObjectViewType, Pair, ReqParams, Property} from '../../../sys/src/types';

    declare let $: JQuery;

    @Component({name: 'GridView', components: {}})
    export default class GridView extends Vue {
        @Prop() private uri: string;
        @Prop() private root: boolean;
        @Prop() private dec: ObjectDec;
        @Prop() private newItem: string;
        private rowHeaderStyle = GridRowHeaderStyle.empty;
        private mainChecked = false;
        private filter = {};
        private filterDoc = {};
        private filteringProp: Property = null;
        private filteredProps: Property[] = [];
        private headFuncs: HeadFunc[] = [];

        get items(): IData[] {
            return this.$store.state.data[this.uri] || [];
        }

        @Watch('uri') // Switching between forms
        onUriReset() {
            this.filteredProps = [];
            this.filterDoc = {};
            this.filter = {};
            this.filteringProp = this.dec.properties[0];
        }

        resetHeadFuncs() {
            this.headFuncs = [];
            if (this.dec.links) {
                this.headFuncs = this.dec.links.filter(link => !link.single).map(link => {
                    return {title: link.title as string, ref: link.address};
                });
            }
        }

        mounted() {
            this.resetHeadFuncs();
            this.filterDoc = {};
            this.filteringProp = this.dec.properties[0];
            for (let prop of this.dec.properties) {
                this.filterDoc[prop.name] = null;
            }
            this.extractFilteredProps();
        }

        filterValueChanged(e: FilterChangeEventArg) {
            this.filterDoc[this.propLocaleName(e.prop)] = e.val;
            this.filter[this.propLocaleName(e.prop)] = e.filterVal;

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

        getFilterDocValue(filterVal: any): any {
            if (typeof filterVal == "string" || typeof filterVal == "number") return filterVal;

            if (filterVal) {
                if (filterVal.$reg) {
                    if (/^\/\^/.test(filterVal.$reg)) return filterVal.$reg.replace(/^\/\^(.+)\/.+/, "$1");
                    else if (/\$\/i?$/.test(filterVal.$reg)) return filterVal.$reg.replace(/^\/(.+)\$\/.+/, "$1");
                    else return filterVal.$reg.replace(/^\/(.+)\/.+/, "$1");
                } else if (filterVal.$gt) return filterVal.$gt;
                else if (filterVal.$gte) return filterVal.$gte;
                else if (filterVal.$lt) return filterVal.$lt;
                else if (filterVal.$lte) return filterVal.$lte;
                else if (filterVal.$in) return filterVal.$in;
                else if (filterVal.$ne === true) return FilterOperator.No;
                else if (filterVal.$ne) return filterVal.$ne;
                else if (filterVal.$nn) return filterVal.$nn;
                else if (filterVal.$none) return filterVal.$none;
                else if (filterVal.$exists) return filterVal.$exists;
                else if (filterVal.$nin) return filterVal.$nin;
            }
            return null;
        }

        extractFilteredProps() {
            this.filteredProps = [];
            if (getQs(ReqParams.query))
                this.filter = JSON.parse(getQs(ReqParams.query));
            else
                this.filter = {};

            for (let key in this.filter) {
                let prop = this.dec.properties.find(p => p.name == key.replace(/\..+/, ""));
                if (prop) {
                    this.filteredProps.push(prop);
                    this.filterDoc[key.replace(/\..+/, "")] = this.getFilterDocValue(this.filter[key]);
                } else
                    console.error(`Property '${key}' not found.`);
            }
        }

        refreshQueryByFilter() {
            let query = null;
            for (let key in this.filter) {
                if (this.filter[key] != null) {
                    query = query || {};
                    query[key] = this.filter[key];
                }
            }
            let ref = setQs(ReqParams.query, query ? JSON.stringify(query) : null, true);
            ref = setQs(ReqParams.page, null, true, ref);
            load(ref, true);
        }

        propLocaleName(prop: Property): string {
            if (prop.text && prop.text.multiLanguage)
                return prop.name + "." + glob.config.locale;
            else
                return prop.name;
        }

        removeFilter(prop) {
            this.filter[this.propLocaleName(prop)] = null;
            this.filterDoc[prop.name] = null;
            this.filteredProps.splice(this.filteredProps.indexOf(prop), 1);
            this.refreshQueryByFilter();
        }

        filterKeyDown(e: ItemEventArg) {
            if (e.event.keyCode == Keys.enter) {
                this.filteredProps.push(this.filteringProp);
                this.refreshQueryByFilter();
            }
        }

        changeFilterProp(e) {
            let items = this.dec.properties.map(prop => {
                return {ref: prop, title: prop.title} as MenuItem
            });
            showCmenu(this, items, e, (state, item: MenuItem) => {
                if (item) state.filteringProp = item.ref;
            });
        }

        clickNewItem() {
            main.load(location.pathname + '?n=1', true);
        }

        clickTitlePin(e: FunctionExecEventArg) {
            let items: MenuItem[] = [
                {ref: "export-excel", title: $t('export-excel')},
                {ref: "export-csv", title: $t('export-csv')},
                {ref: "export-pdf", title: $t('export-pdf')},
                {title: "-"},
                {ref: "import", title: $t('import')},
                {title: "-"},
                {ref: "print", title: $t('print')},
            ];
            main.showCmenu(null, items, e.event, (state, item: MenuItem) => {
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
                    if (getQs(Constants.QUERY_NEW)) {
                        notify("Please save your changes before!", LogType.Warning);
                        return;
                    }
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
                main.load(href, true);
            }
        }

        goForward() {
            if (this.dec.page < this.dec.pages) {
                let href = main.setQs(ReqParams.page, this.dec.page + 1, true);
                main.load(href, true);
            }
        }

        showColumnMenu(prop, e) {
            let items: MenuItem[] = [
                {ref: 'sort', title: $t('sort')},
                {ref: "filter", title: $t('filter')},
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
                        this.filteringProp = state;
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
            let item = this.items.find(item => item._.marked);
            main.commitReorderItems(this.$store, this.items, up, uri, item);
        }
    }
</script>

<style lang="scss">
    $left: var(--left);
    $right: var(--right);

    .grid-view-box {
        border-radius: 2px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    }

    .grid-view {

        table {
            background: #fff;
            /*color: rgba(0, 0, 0, 0.54);*/
        }

        td {
            padding: 0;
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
            padding: .25rem .5rem;
            user-select: none;
            -webkit-user-select: none;

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

        .filter-chip {
            border-radius: 18px;
            margin-top: -.7rem;
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
