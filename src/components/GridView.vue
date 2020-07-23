<template>
    <div :class="{'main-body h-100 grid-view-container d-flex flex-column flex-fill overflow-auto':1, 'root': !level}">
        <!-- Toolbar -->
        <div v-if="!level" :class="{'d-flex align-items-center p-2 btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">
            <Breadcrumb :count="dec.count" :breadcrumb="glob.form.breadcrumb" :title="glob.form.breadcrumbLast"/>

            <ToolbarModifyButtons/>

            <!-- Filter -->
            <div v-if="showFilter" class="filter-chip border d-flex py-0 align-items-center px-2 bg-white mx-4 rounded">
                <i class="fal fa-filter p-1 d-inline-block text-muted"></i>
                <PropertyFilter :allowPropChange="true" @changed="filterValueChanged" @changeFilterProp="changeFilterProp" :prop="filteringProp" :filter="filter" :filterDoc="filterDoc"/>
            </div>

            <div class="mr-auto"></div>

            <!-- Head functions -->
            <template v-for="func in headFuncs">
                <a :href="func.ref" :class="`${func.style||'btn btn-success mx-1 px-2'}`" v-if="func.ref">{{func.title}}</a>
                <Function v-else styles="btn-primary mx-1" :name="func.name" @exec="func.exec" :title="func.title"/>
            </template>

            <!-- Add button -->
            <button v-if="addButton" class="btn btn-success mx-1 px-4" @click="clickNewItem"><i :class="{'fal fa-plus-circle':1,'pr-2':ltr, 'pl-2':rtl}"></i>Add</button>

            <!--  Refresh -->
            <button class="btn btn-link text-secondary px-2" @click="refresh"><i class="fas fa-sync"></i></button>

            <!--  Help -->
            <a v-if="helpLink" title="Help" target="_blank" class="btn btn-link text-secondary px-2" :href="helpLink.address"><i class="fal fa-question-circle fa-lg"></i></a>

            <!-- Object Menu -->
            <button class="btn btn-link text-secondary px-2" @click="clickObjectMenu"><i class="fal fa-cog fa-lg"></i></button>
        </div>

        <!-- Content -->
        <div class="w-100 h-100 grid-content-panel overflow-auto d-flex">
            <div :class="{'d-flex w-100 overflow-auto':true, 'bg-white':level}" @scroll="onScroll()">
                <!--  Side Menu -->
                <aside v-if="!level && (recentItems || dec.filterDec)" class="overflow-hidden border-right separator-line bg-white d-none d-md-block">
                    <div v-if="dec.filterDec" class="sidenav-filter p-3">
                        <label class="text-muted small"><i class="fal fa-filter p-1"></i>Filter {{glob.form.breadcrumbLast}}:</label>
                        <DetailsView :dec="dec.filterDec" :data="dec.filterData" :level="level?level+1:1" @changed="objectFilterChanged"></DetailsView>
                    </div>
                    <div v-if="recentItems" class="recent-items pt-3">
                        <label class="text-muted small mx-3 mt-3 font-weight-bold">Recent {{glob.form.breadcrumbLast}}:</label>
                        <ul class="nav flex-column">
                            <li v-for="item in recentItems" class="nav-item">
                                <a @click="clickRecentItem(item)" class="text-nowrap nav-link" :href="item.ref">{{item.title}}</a>
                            </li>
                        </ul>
                    </div>
                </aside>

                <!--  Main -->
                <div :class="{'w-100 grid-view':1, 'p-4 main-bg-image':!level}">

                    <!-- Filter Items -->
                    <div v-if="filter && filteringProp && (filteredProps || []).length" class="pb-2 d-flex">
                        <div v-for="prop of filteredProps" class="filter-chip border d-flex align-items-center px-2 bg-white mr-2">
                            <PropertyFilter :allowPropChange="false" :prop="prop" :filter="filter" @changed="filterValueChanged" :filterDoc="filterDoc"/>
                            <i @click="removeFilter(prop)" class="fas fa-times p-1 text-dark"></i>
                        </div>
                    </div>

                    <!-- Grid View -->
                    <table :class="{'bg-white':1,'grid-view-box mb-5':!level}">
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
                        <grid-view-row :dec="getDec(item)" @selected="rowSelected" :selectable="rowHeaderStyle===2" @keydown="keydown" @headerClick="showRowMenu" v-for="item in items" :item="item" :readonly="!(dec.access&2)" @changed="changed"/>
                        </tbody>

                        <!-- Footer -->
                        <tfoot>
                        <tr>
                            <td class="border-0" colspan="100">
                                <div class="align-items-center d-flex">
                                    <!-- Add -->
                                    <Function v-if="dec.access & 4" styles="m-1 fal fa-plus-circle" @exec="insert" name="newItem" :title="$t('add')"></Function>

                                    <!-- Delete -->
                                    <Function v-if="rowHeaderStyle===2" styles="fas fa-trash" @exec="deleteItems" name="deleteItems" :title="$t('delete')"></Function>

                                    <!-- Paging -->
                                    <div class="flex-grow-1 d-flex align-items-center">
                                        <ul v-if="dec.pages > 1" class="m-2 pagination ">
                                            <li class="page-item" data-toggle="tooltip" title="Previous Page">
                                                <a @click="goBack" href="javascript:;" class="page-link"> <i :class="{'fa':1,'fa-chevron-right':rtl,'fa fa-chevron-left':ltr}"></i> </a>
                                            </li>
                                            <li v-for="page in dec.pageLinks" :class="'page-item' + (page.active ? ' active':'') ">
                                                <a class="page-link" :href="page.ref">{{page.title}}</a></li>
                                            <li class="page-item" data-toggle="tooltip" title="Next Page">
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

                <div v-if="dec.comment" class="help-side p-4 overflow-hidden border-left separator-line bg-white d-none d-md-block">
                    <h4>{{glob.form.breadcrumbLast}}</h4>
                    <div v-html="comment()"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import * as main from '../main';
    import {$t, call, getQs, glob, load, markDown, notify, pushToGridViewRecentList, setQs, showCmenu} from '../main';
    import {parse, stringify} from 'bson-util';
    import {ChangeType, Constants, FilterChangeEventArg, FilterOperator, HeadFunc, ID, ItemChangeEventArg, ItemEventArg, JQuery, MenuItem, StateChange} from '../types';
    import {AccessPermission, EntityMeta, EntityLink, FileType, GridRowHeaderStyle, IData, Keys, LinkType, LogType, NewItemMode, ObjectDec, ObjectViewType, Pair, Property, ReqParams} from '../../../sys/src/types';

    declare let $: JQuery;

    @Component({name: 'GridView'})
    export default class GridView extends Vue {
        @Prop() private uri: string;
        @Prop() private data: IData[];
        @Prop() private dec: ObjectDec;
        @Prop() private level: number;

        private rowHeaderStyle = GridRowHeaderStyle.empty;
        private recentItems: Pair[] = null;
        private addButton: boolean = false;
        private mainChecked = false;
        private filter = null;
        private filterDoc = {};
        private filteringProp: Property = null;
        private filteredProps: Property[] = [];
        private headFuncs: HeadFunc[] = [];
        private helpLink: EntityLink = null;

        getDec(item: IData) {
            return this.dec || item._.dec;
        }

        comment() {
            return markDown(this.dec.comment);
        }

        get items(): IData[] {
            if (this.data) // when we explicitly specify the data
                return this.data;
            else
                return this.$store.state.data[this.uri] || [];
        }

        refresh() {
            main.load(location.pathname, false);
        }

        @Watch('uri') // Switching between forms
        onUriReset() {
            this.resetFilterParameters();
            this.resetHeadFuncs();
            this.resetRecentItems();
            this.checkForAddButton();
        }

        checkForAddButton() {
            this.addButton = (this.dec.access & AccessPermission.NewItem) && this.dec.newItemMode == NewItemMode.newPage;
        }

        clickRecentItem(item: Pair) {
            pushToGridViewRecentList(location.pathname.replace(/^\//, ""), item.ref, item.title);
        }

        resetRecentItems() {
            let recent = localStorage.getItem("gridView-recentItems-" + location.pathname.replace(/^\//, ""));
            this.recentItems = recent ? JSON.parse(recent) : null;
        }

        get showFilter() {
            return this.filter && glob.form.breadcrumb.length == 0;
        }

        resetFilterParameters() {
            this.filteredProps = [];
            this.filterDoc = {};
            this.filter = {$and: []};
            this.filteringProp = this.dec.properties[0];
        }

        objectFilterChanged(e: ItemChangeEventArg) {
            console.log("this.dec.filterData", this.dec.filterData);
            let ref = setQs(ReqParams.query, stringify(this.dec.filterData, true), true);
            ref = setQs(ReqParams.page, null, true, ref);
            load(ref, true);
        }

        resetHeadFuncs() {
            this.headFuncs = [];
            if (this.dec.links) {
                this.headFuncs = this.dec.links.filter(link => !link.disable && !link.type).map(link => {
                    return {title: link.title as string, ref: link.address};
                });
            }

            this.helpLink = this.dec.links.find(k => k.type == LinkType.Help);
        }

        mounted() {
            // console.log("this.items", this.items);
            this.resetHeadFuncs();
            this.resetRecentItems();
            this.checkForAddButton();

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

        filterValueChanged(e: FilterChangeEventArg) {
            this.filterDoc[e.prop.name] = e.val;

            let previousFilter = this.filter.$and.find(i => e.prop.name == Object.keys(i.$or[0])[0]);
            if (e.prop.text && e.prop.text.multiLanguage) {
                let filter1 = {};
                filter1[e.prop.name] = e.filterVal;
                let filter2 = {};
                filter2[e.prop.name + "." + glob.config.locale] = e.filterVal;
                if (previousFilter)
                    previousFilter.$or = [filter1, filter2];
                else
                    this.filter.$and.push({$or: [filter1, filter2]});
            } else {
                let filter = {};
                filter[e.prop.name] = e.filterVal;
                if (previousFilter)
                    previousFilter.$or = [filter];
                else
                    this.filter.$and.push({$or: [filter]});
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

        getFilterDocValue(filterVal: any): any {
            if (typeof filterVal == "string" || typeof filterVal == "number") return filterVal;

            if (filterVal) {
                if (filterVal instanceof RegExp) {
                    if (/^\/\^/.test(filterVal.toString())) return filterVal.toString().replace(/^\/\^(.+)\/.+/, "$1");
                    else if (/\$\/i?$/.test(filterVal.toString())) return filterVal.toString().replace(/^\/(.+)\$\/.+/, "$1");
                    else return filterVal.toString().replace(/^\/(.+)\/.+/, "$1");
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
                this.filter = parse(getQs(ReqParams.query), true, ID);
            else
                this.filter = {$and: []};

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
                    } else
                        console.error(`Property '${key}' not found.`);
                }
            } else {
                for (let key in this.filter) {
                    let prop = this.dec.properties.find(p => p.name == key.replace(/\..+/, ""));
                    if (prop) {
                        this.filteredProps.push(prop);
                        this.filterDoc[key] = this.getFilterDocValue(this.filter[key]);
                    } else
                        console.error(`Property '${key}' not found.`);
                }
            }
            // console.log("this.filterDoc", this.filterDoc);
        }

        refreshQueryByFilter() {
            let ref = setQs(ReqParams.query, this.filter.$and.length ? stringify(this.filter, true) : null, true);
            ref = setQs(ReqParams.page, null, true, ref);
            load(ref, true);
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
                return {ref: prop, title: prop.title} as MenuItem
            });
            showCmenu(this, items, e, (state, item: MenuItem) => {
                if (item) state.filteringProp = item.ref;
            });
        }

        clickNewItem() {
            main.load(location.pathname + '?n=1', true);
        }

        clickObjectMenu(e) {
            let items: MenuItem[] = [
                {ref: "export-excel", title: $t('export-excel')},
                {ref: "export-csv", title: $t('export-csv')},
                {ref: "export-pdf", title: $t('export-pdf')},
                {title: "-"},
                {ref: "import", title: $t('import')},
                {title: "-"},
                {ref: "email-excel", title: $t('email-excel')},
                {ref: "email-csv", title: $t('email-csv')},
                {ref: "email-pdf", title: $t('email-pdf')},
                {title: "-"},
                {ref: "print", title: $t('print')},
            ];
            main.showCmenu(null, items, e, (state, item: MenuItem) => {
                switch (item.ref) {
                    case "export-csv":
                        call('exportData', {type: FileType.Csv}, (err, res) => {

                        });
                        break;

                    default:
                        notify('File type not supported yet', LogType.Error);
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
                type: e.type,
                prop: e.prop,
                value: e.val,
                item: e.item,
                uri: this.uri + "/" + e.item._id,
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
                    let ref = "/" + this.uri + '?n=1';
                    if (this.dec.newItemDefaults)
                        ref += "&d=" + this.dec.newItemDefaults;
                    main.load(ref, true);
                    break;

                default:
                    if (getQs(Constants.QUERY_NEW)) {
                        notify("Please save your changes before!", LogType.Warning);
                        return;
                    }
                    let newItem = {_id: ID.generateByBrowser(), _new: true, _: {marked: false, dec: this.dec} as EntityMeta};
                    if (this.dec.newItemDefaults) {
                        let defaults = parse(this.dec.newItemDefaults, true, ID);
                        Object.assign(newItem, defaults);
                    }
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

            if (e.item._id) {
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
                        let href = main.prepareServerUrl(`${this.dec.ref}/${state._id}`);
                        main.load(href, true);
                        break;
                    }

                    case 'tree': {
                        if (!state._id) {
                            main.notify('ID is expected, please check the item data!', LogType.Error);
                            console.error(state);
                            return;
                        }
                        let href = main.prepareServerUrl(`${this.dec.ref}/${state._id}?t=${ObjectViewType.TreeView}`);
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

    .grid-view-box tfoot td {
        border: 1px solid var(--object-border) !important;
    }

    .grid-view-container {
        aside {
            min-width: 12rem;
        }

        .help-side {
            min-width: 15rem;
        }
    }

    .grid-view {

        td {
            padding: 0;
        }

        td, th {
            border: 1px solid var(--grid-border);
        }

        th {
            border-top-color: var(--object-border);
            border-left-color: var(--object-border);
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

    .sidenav-filter {
        min-width: 360px;
    }
</style>
