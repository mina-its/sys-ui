<template>
    <div :class="{'details-view-container h-100 d-flex w-100 flex-column':1, 'root': !level}">
        <!--  Toolbar -->
        <div v-if="!level" :class="{'d-flex p-2 align-items-center btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

            <!--  Breadcrumb -->
            <Breadcrumb :breadcrumb="glob.form.breadcrumb" :title="glob.form.breadcrumbLast"/>

            <!--  Toolbar Apply/Cancel -->
            <ToolbarModifyButtons/>

            <!--  Head Functions -->
            <div class="mr-auto"></div>
            <template v-for="func in headFuncs">
                <a :href="func.ref" :class="`${func.style||'btn btn-success mx-1 px-2'}`" v-if="func.ref">{{func.title}}</a>
                <Function v-else styles="btn-primary mx-1" :name="func.name" @exec="func.exec" :title="func.title"/>
            </template>

            <!--  Refresh -->
            <button class="btn btn-link text-secondary px-2" @click="refresh"><i class="fas fa-sync"></i></button>

            <!--  Object Menu -->
            <button class="btn btn-link text-secondary px-2" @click="clickObjectMenu"><i class="fal fa-cog fa-lg"></i></button>

            <!-- Info Panel -->
            <button title="Show info panel" v-if="!glob.infoPanel.show" @click="glob.infoPanel.show=true" class="btn close-panel btn-link px-2"><i class="fal fa-info-circle fa-lg"></i></button>
        </div>

        <!--  Content -->
        <div class="w-100 h-100 main-bg-image overflow-auto d-flex">
            <div :class="{'d-flex w-100 overflow-auto details-view':true, 'bg-white':level}" @scroll="onScroll()">

                <!--  Side Menu -->
                <aside v-if="sideMenuVisible" class="border-right separator-line sidenav py-4 d-none d-md-block">
                    <ul class="nav flex-column" id="menus">
                        <li v-for="item in sideMenu" class="nav-item">
                            <a @click="selectGroup(item)"
                               :class="{'text-nowrap text-secondary nav-link': 1, 'font-weight-bold active': $data.currentGroup===item.title}"
                               href="javascript:void(0);">{{item.title}}</a>
                        </li>
                    </ul>
                </aside>

                <!--  Group Property Link -->
                <div v-if="groupPropertyLink" class="p-4 group-property-link grid-view-box">
                    <object-view :level="2" :uri="groupPropertyLink"></object-view>
                </div>

                <!--  Main -->
                <div v-else :class="{'p-4 flex-grow-1':!level, 'border rounded': level && dec.detailsViewType===ObjectDetailsViewType_Tabular}">
                    <div v-if="groupVisible(group)" :class="groupPanelStyle(group)" v-for="group in groups" :id="getGroupId(group)">
                        <h3 v-if="groupHeadVisible(group)" class="text-secondary mb-4">{{group}}</h3>
                        <div class="group">
                            <template v-for="prop in getProps(group)">
                                <label v-if="isNotAloneInlineDataGridProperty(group, prop, item)" class="prop-label from-outside-label pt-2">{{prop.title}}</label>
                                <Property :level="level?level+1:1" :readonly="!(dec.access&AccessPermission_Edit)" :item="item" :prop="prop" @changed="changed" :viewType="ObjectDetailsViewType_Tabular"/>
                            </template>
                        </div>
                    </div>
                    <div v-if="nonGroupVisible()" :class="{'gp':!level}">
                        <Property :level="level?level+1:1" :readonly="!(dec.access&AccessPermission_Edit)" v-for="prop in dec.properties" :item="item" :prop="prop" @changed="changed" :viewType="ObjectDetailsViewType_Tabular"/>
                    </div>
                    <div v-if="!level" class="h-25"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ChangeType, HeadFunc, ID, ItemChangeEventArg, MenuItem, StateChange} from '../types';
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AccessPermission, EntityLink, Context, EntityMeta, GlobalType, LinkType, ObjectDec, ObjectDetailsViewType, ObjectListsViewType, PropertyReferType} from "../../../sys/src/types";
    import {$t, getNewItemTitle, glob, loadObjectViewData, markDown} from '../main';
    import * as main from '../main';
    import ObjectView from "./ObjectView.vue";

    declare let $: any;

    @Component({name: 'DetailsView', components: {ObjectView}})
    export default class DetailsView extends Vue {
        @Prop() private uri: string;
        @Prop() private data: any;
        @Prop() private dec: ObjectDec;
        @Prop() private level: number;

        private currentGroup: string = this.groups[0];
        private groupPropertyLink: string = null;
        private headFuncs: HeadFunc[] = [];
        private AccessPermission_Edit = AccessPermission.Edit;
        private ObjectDetailsViewType_Tabular = ObjectDetailsViewType.Tabular;

        comment() {
            return markDown(this.dec.comment);
        }

        isNotAloneInlineDataGridProperty(group, prop) {
            return prop._.gtype == GlobalType.object && prop.isList && (this.level > 0);
        }

        groupPanelStyle(group: string): string {
            let style = this.dec.detailsViewType === ObjectDetailsViewType.Tabular ? 'py-4' : "";
            let props = this.getProps(group);
            if (props && props.length == 1) {
                let theProp = props[0];
                if (theProp.isList) {
                    if (theProp.listsViewType == ObjectListsViewType.Card)
                        return "";
                    else if (!this.level)
                        return "grid-view-box";
                }
            }

            if (!this.level) style += " gp";
            return style;
        }

        resetHeadFuncs() {
            this.headFuncs = [];
            if (this.dec.links) {
                this.headFuncs = this.dec.links.filter(link => !link.disable && !link.type).map(link => {
                    return {title: link.title as string, ref: link.address};
                });
            }
        }

        mounted() {
            this.resetHeadFuncs();
            this.reloadLastGroup();
        }

        refresh() {
            main.load(location.pathname, false);
        }

        clickObjectMenu(e) {
            let items: MenuItem[] = [
                {ref: "print", title: $t('print')}
            ];
            main.showCmenu(null, items, e, (state, item: MenuItem) => {
                switch (item.ref) {
                    case "print":
                        window.print();
                        break;
                }
            });
        }

        getGroupId(group: string) {
            if (!this.level)
                return 'gp-' + group.replace(/\s/g, '-');
            else
                return undefined;
        }

        @Watch('uri')
        onPropertyChanged(value: string, oldValue: string) {
            this.currentGroup = this.groups[0];
            this.groupPropertyLink = null;
            this.resetHeadFuncs();
        }

        saveLastGroup(item) {
            if (typeof (Storage) === "undefined") return;
            localStorage.setItem("_gp" + location.pathname, JSON.stringify(item));
        }

        reloadLastGroup() {
            if (typeof (Storage) === "undefined") return;
            let item = localStorage.getItem("_gp" + location.pathname);
            if (item)
                this.selectGroup(JSON.parse(item));
            else
                this.currentGroup = this.groups[0];
        }

        loadPropertyGroupLinkData(address: string) {
            loadObjectViewData(address, this.data, (err, res) => {
                this.groupPropertyLink = res.ref;
            });
        }

        selectGroup(item) {
            this.currentGroup = item.title;
            this.saveLastGroup(item);

            // Property Group Link
            if (/^\//.test(item.uri))
                return this.loadPropertyGroupLinkData(item.uri);
            else
                this.groupPropertyLink = null;

            if (this.dec.detailsViewType == ObjectDetailsViewType.Tabular) {
                let $dv = $(".details-view");
                $dv.animate({scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top}, 0);
            }

            let props = this.getProps(this.currentGroup);
            let newItemLink = this.headFuncs.find(i => i.name == "new-item");
            if (newItemLink) this.headFuncs.splice(this.headFuncs.indexOf(newItemLink), 1);

            // The Group is a list property
            if (props && props.length == 1 && props[0].isList) {
                let prop = props[0];
                switch (prop.referType) {
                    case PropertyReferType.inlineData:
                        let title = getNewItemTitle(prop.title);
                        this.headFuncs.push({
                            title, name: "new-item", exec: () => {
                                let uri = this.uri + "/" + prop.name;
                                let dec = glob.form.declarations[uri];
                                let newItem = {_id: ID.generateByBrowser(), _new: true, _: {marked: false, dec} as EntityMeta};
                                this.dec.properties.forEach(p => newItem[p.name] = null);
                                // if (this.dec.reorderable)
                                //     newItem['_z'] = (Math.max(...val.map(item => item._z)) || 0) + 1;

                                if (this.data) {
                                    this.data[uri].push(newItem);
                                } else
                                    main.dispatchStoreModify(this, {
                                        type: ChangeType.InsertItem,
                                        item: newItem,
                                        uri,
                                        vue: this
                                    } as StateChange);
                            }
                        });
                        break;
                }
            }
        }

        nonGroupVisible() {
            return this.groups.length <= 1;
        }

        groupVisible(group) {
            if (this.groups.length <= 1) return false;
            if (!this.level)
                return this.dec.detailsViewType == ObjectDetailsViewType.Tabular || this.currentGroup == group;
            else
                return true;
        }

        groupHeadVisible(group) {
            let props = this.getProps(group);
            // if (props && props.length == 1 && props[0].isList) return true;
            return !this.level && this.dec.detailsViewType == ObjectDetailsViewType.Tabular;
        }

        onScroll() {
            main.hideCmenu();
        }

        execLink(cn: Context) {
            let data = {data: this.item};
            main.ajax("/" + cn.name, data, null, main.handleResponse, (err) => {
                    main.notify(err);
                }
            );
        }

        @Emit('changed')
        emitChanged(e: ItemChangeEventArg) {
            return e;
        }

        changed(e: ItemChangeEventArg) {
            if (this.data) {
                e.vue.$set(e.item, e.prop.name, e.val);
                this.emitChanged(e);
            } else
                main.dispatchStoreModify(this, {
                    type: ChangeType.EditProp,
                    prop: e.prop,
                    value: e.val,
                    item: e.item,
                    uri: this.uri,
                    vue: e.vue
                } as StateChange);

            // Check the properties which are depends to the changed property
            let dependents = this.dec.properties.filter(p => p.dependsOn && p.dependsOn.split(',').indexOf(e.prop.name) > -1 && this.item[e.prop.name] != null);
            for (const prop of dependents) {
                this.changed({item: this.item, prop, val: null, vue: this} as ItemChangeEventArg);
            }
        }

        getProps(group: string) {
            let props = this.dec.properties.filter(prop => {
                if (prop.properties)
                    return group == prop.title;
                else
                    return prop.group == group;
            });
            return props;
        }

        get sideMenuVisible() {
            return this.sideMenu && !this.level && (!this.dec.detailsViewType ||
                this.dec.detailsViewType == ObjectDetailsViewType.Grouped ||
                this.dec.detailsViewType == ObjectDetailsViewType.Tabular);
        }

        get sideMenu() {
            let menus = [];
            for (const grp of this.groups) {
                menus.push({uri: "#gp-" + grp.replace(/\s/g, "-"), title: grp});
            }

            let propertyGroupLinks = this.dec.links ? this.dec.links.filter(link => !link.disable && link.type == LinkType.PropertyGroupLink).map(link => {
                return {title: link.title as string, uri: link.address};
            }) : [];

            menus = [...menus, ...propertyGroupLinks];

            if (menus.length <= 1) menus = null;
            return menus;
        }

        get item() {
            if (this.data) // when we explicitly specify the data
                return this.data;
            else
                return this.$store.state.data[this.uri];
        }

        get groups() {
            // this.dec.properties.forEach(p => {
            //     if (p.condition) {
            //         console.log(p.condition);
            //     }
            // });
            let props = this.dec.properties.filter(p => p.group && (p.condition == null || main.evalExpression(this.item, p.condition)));
            return props.map(p => p.group).filter(main.onlyUnique);
        }
    }
</script>

<style lang="scss">

    .details-view {
        scroll-behavior: smooth;
        min-width: 100%;


        .group-property-link {
            .grid-content-panel {
                height: auto !important;
            }
        }

        .form-group {
            margin-bottom: .5rem;
        }

        .sidenav {
            background-color: white;
            min-width: 220px;
        }

        label {
            color: var(--form-label);
            font-weight: 600;
        }

        input {
            border-color: var(--grid-border);
        }

        .gp {
            background: #fff;
            border: 1px solid var(--object-border);
            margin-bottom: 12px;
            margin-left: auto;
            margin-right: auto;
            outline: none;
            position: relative;
            padding: 30px;
        }

        .active {
            background-color: #d8d8d8;
        }
    }

    .compress-view {
        .form-group {
            margin-bottom: 0;
        }
    }
</style>
