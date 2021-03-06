<template>
    <layout-default :justContent="!!level" :globalFunctions="globalFunctions" :showSideMenu="showSideMenu">

        <!--  Side Menu -->
        <template slot="side-menu">
            <ul class="details-view nav flex-column" id="menus">
                <li v-for="item in sideMenu" class="nav-item">
                    <a @click="selectGroup(item)"
                       :class="{'text-nowrap text-secondary nav-link': 1, 'font-weight-bold active': $data.currentGroup===item.title}"
                       href="javascript:void(0);">{{item.title}}</a>
                </li>
            </ul>
        </template>

        <!--  Main Content -->
        <template slot="main-content">
            <!--  Group Property Link -->
            <div v-if="groupPropertyLink" class="group-property-link grid-view-box">
                <!-- I removed class 'p-4' because of bid.estates  -->
                <object-view :level="1" :uri="groupPropertyLink"></object-view>
            </div>

            <!--  Main -->
            <div v-else :class="{'details-view d-inline-block':1,'border rounded': level && dec.detailsViewType===ObjectDetailsViewType_Tabular}">
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
        </template>

    </layout-default>
</template>

<script lang="ts">
    import {ChangeType, ExecContext, GlobalFunction, ID, ItemChangeEventArg, MenuItem, StateChange} from '../types';
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import {AccessAction, EntityMeta, GlobalType, LinkType, ObjectDec, ObjectDetailsViewType, ObjectListsViewType, PropertyReferType} from "../../../sys/src/types";
    import {$t, getNewItemTitle, glob, loadObjectViewData, markDown, onListAddNewItem, parse, prepareServerUrl} from '../main';
    import * as main from '../main';
    import ObjectView from "./ObjectView.vue";
    import LayoutDefault from "./LayoutDefault.vue";

    declare let $: any;

    @Component({name: 'DetailsView', components: {LayoutDefault, ObjectView}})
    export default class DetailsView extends Vue {
        @Prop() private uri: string;
        @Prop() private data: any;
        @Prop() private dec: ObjectDec;
        @Prop() private level: number;

        private currentGroup: string = this.groups[0];
        private groupPropertyLink: string = null;
        private globalFunctions: GlobalFunction[] = [];
        private AccessPermission_Edit = AccessAction.Edit;
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
            this.globalFunctions = [];
            if (this.dec.links) {
                this.globalFunctions = this.dec.links.filter(link => !link.disable && !link.type).map(link => {
                    return {title: link.title as string, style: link.style, ref: prepareServerUrl(link.address, true)};
                });
            }
        }

        mounted() {
            this.resetHeadFuncs();
            this.reloadLastGroup();
        }

        getGroupId(group: string) {
            return this.level ? undefined : this.getGroupUri(group);
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
            if (item) {
                let grp = JSON.parse(item);
                if (this.groups.indexOf(grp.title) > -1) {
                    this.selectGroup(grp);
                    return;
                }
            }
            this.currentGroup = this.groups[0];
        }

        loadPropertyGroupLinkData(address: string) {
            loadObjectViewData(address, this.data, (err, res) => {
                this.groupPropertyLink = res.ref;
            });
        }

        selectGroup(item) {
            console.log('selectGroup');
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
            let newItemLink = this.globalFunctions.find(i => i.name == "new-item");
            if (newItemLink) this.globalFunctions.splice(this.globalFunctions.indexOf(newItemLink), 1);

            // The Group is a list property
            if (props && props.length == 1 && props[0].isList) {
                let prop = props[0];
                switch (prop.referType) {
                    case PropertyReferType.inlineData:
                        let title = getNewItemTitle(prop.title);
                        this.globalFunctions.push({
                            title, style: "border-chip btn-secondary", name: "new-item", exec: () => {
                                let uri = this.uri + "/" + prop.name;
                                let dec = glob.form.declarations[uri] as ObjectDec;

                                if (this.data) {
                                    let newItem = {_id: ID.generateByBrowser(), _new: true, _: {marked: false, dec} as EntityMeta} as any;
                                    if (dec.newItemDefaults) {
                                        let defaults = parse(dec.newItemDefaults, true, ID);
                                        Object.assign(newItem, defaults);
                                    }
                                    dec.properties.forEach(prop => newItem[prop.name] = null);
                                    this.data[uri].push(newItem);
                                } else
                                    onListAddNewItem(this, dec as ObjectDec, uri);
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

        execLink(cn: ExecContext) {
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

        get showSideMenu() {
            return this.sideMenu && !this.level && (!this.dec.detailsViewType ||
                this.dec.detailsViewType == ObjectDetailsViewType.Grouped ||
                this.dec.detailsViewType == ObjectDetailsViewType.Tabular);
        }

        getGroupUri(group: string) {
            let uri = "gp-";
            if (this.uri) uri += this.uri.replace(/^(\w+).+/, "$1") + "-";
            uri += group.replace(/\s/g, "-");
            return uri;
        }

        get sideMenu() {
            let menus = [];
            for (const grp of this.groups) {
                menus.push({uri: this.getGroupUri(grp), title: grp});
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
                return this["$store"].state.data[this.uri];
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

        .group-property-link {
            .grid-content-panel {
                height: auto !important;
            }
        }

        .form-group {
            margin: .5rem 0;
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
            min-width: 20rem;
            border: 1px solid var(--object-border);
            margin-bottom: 12px;
            margin-left: auto;
            margin-right: auto;
            outline: none;
            position: relative;
            padding: 30px;
        }

        #gp-roles-Permissions {
            .form-group {
                display: inline-block;
            }

            .p_resourceType {
                .prop-value {
                    width: 6rem;
                    text-align: center;
                    background-color: #eee;
                }
            }

            .p_objAction {
                .prop-value {
                    width: 5rem;
                    text-align: center;
                }
            }

            .p_funcAction {
                .prop-value {
                    width: 5rem;
                    text-align: center;
                }
            }

            .p_formAction {
                .prop-value {
                    text-align: center;
                    width: 5rem;
                }
            }

            .p_driveAction {
                .prop-value {
                    text-align: center;
                    width: 5rem;
                }
            }
        }
    }

    .nav-panel .details-view .active {
        background-color: #d8d8d8 !important;
    }

    .compress-view {
        .form-group {
            margin-bottom: 0;
        }
    }
</style>
