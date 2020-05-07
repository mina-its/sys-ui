<template>
    <div class="d-flex overflow-auto details-view" @scroll="onScroll()">
        <aside v-if="sideMenuVisible" class="border-right separator-line sidenav p-2 py-4 d-none d-md-block">
            <ul :class="{'nav flex-column tree':1, 'pr-5':ltr, 'pl-5':rtl}" id="menus">
                <li v-for="item in sideMenu" class="nav-item">
                    <a @click="selectGroup(item)"
                       :class="{'text-nowrap text-secondary nav-link': 1, 'pr-5':ltr, 'pl-5':rtl, 'active': $data.currentGroup===item.title}"
                       href="javascript:void(0);">{{item.title}}</a>
                </li>
            </ul>
        </aside>
        <div :class="{'p-4':root, 'border rounded': !root && dec.detailsViewType===2}">
            <div v-if="groupVisible(group)" :class="groupPanelStyle(group)"
                 v-for="group in groups"
                 :id="getGroupId(group)">
                <h3 v-if="groupHeadVisible(group)" class="text-secondary mb-4">{{group}}</h3>
                <div class="group">
                    <Property :readonly="!(dec.access&2)" v-for="prop in getProps(group)" :key="prop.name" :item="item" :prop="prop" @changed="changed"
                          :viewType="2"></Property>
                </div>
            </div>
            <div v-if="nonGroupVisible()" :class="{'gp':root}">
                <Property v-for="prop in dec.properties" :key="prop.name" :item="item" :prop="prop"
                      @changed="changed" :viewType="2"></Property>
            </div>
            <div v-if="root" class="h-25"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ChangeType, ItemChangeEventArg, JQuery, StateChange} from '@/types';
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Context, ObjectDec, ObjectDetailsViewType, ObjectListsViewType, EntityMeta} from "../../../sys/src/types";
    import {$t, glob} from '@/main';
    import * as main from '../main';
    import {v4 as uuidv4} from 'uuid';

    declare let $: JQuery;

    @Component({name: 'DetailsView', components: {}})
    export default class DetailsView extends Vue {
        @Prop() private uri: string;
        @Prop() private root: boolean;
        @Prop() private dec: ObjectDec;
        currentGroup: string = this.groups[0];

        groupPanelStyle(group: string): string {
            let style = this.dec.detailsViewType === ObjectDetailsViewType.Tabular ? 'py-4' : "";
            let props = this.getProps(group);
            if (props && props.length == 1) {
                let theProp = props[0];
                if (theProp.isList) {
                    if (theProp.listsViewType == ObjectListsViewType.Card)
                        return "";
                    else if (this.root)
                        return "grid-view-box";
                }
            }

            if (this.root) style += " gp";
            return style;
        }

        mounted() {
            if (this.root) {
                glob.headFuncs = [];
                if (this.dec.links)
                    for (const link of this.dec.links) {
                        glob.headFuncs.push({
                            title: link.title as string,
                            name: link.address["$oid"],
                            exec: this.execLink
                        });
                    }
            }

            this.reloadLastGroup();
        }

        getGroupId(group: string) {
            if (this.root)
                return 'gp-' + group.replace(/\s/g, '-');
            else
                return undefined;
        }

        @Watch('uri')
        onPropertyChanged(value: string, oldValue: string) {
            this.currentGroup = this.groups[0];
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
        }

        selectGroup(item) {
            this.currentGroup = item.title;
            this.saveLastGroup(item);

            // history.pushState(null, null, item.ref);
            if (this.dec.detailsViewType == ObjectDetailsViewType.Tabular) {
                let $dv = $(".details-view");
                $dv.animate({
                        scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
                    }, 0
                );
            }

            let props = this.getProps(this.currentGroup);
            if (props && props.length == 1 && props[0].isList) {
                glob.headFuncs = [
                    {
                        title: $t("new-item"), name: "string", exec: () => {
                            let uri = this.uri + "/" + props[0].name;
                            let dec = glob.form.declarations[uri];
                            let newItem = {_id: uuidv4(), _: {marked: false, dec} as EntityMeta};
                            this.dec.properties.forEach(prop => newItem[prop.name] = null);
                            // if (this.dec.reorderable)
                            //     newItem['_z'] = (Math.max(...val.map(item => item._z)) || 0) + 1;

                            main.dispatchStoreModify(this, {
                                type: ChangeType.InsertItem,
                                item: newItem,
                                uri,
                                vue: this
                            } as StateChange);
                        }
                    }
                ];
            } else
                glob.headFuncs = [];
        }

        nonGroupVisible() {
            return this.groups.length <= 1;
        }

        groupVisible(group) {
            if (this.groups.length <= 1) return false;
            if (this.root)
                return this.dec.detailsViewType == ObjectDetailsViewType.Tabular || this.currentGroup == group;
            else
                return true;
        }

        groupHeadVisible(group) {
            let props = this.getProps(group);
            // if (props && props.length == 1 && props[0].isList) return true;
            return this.root && this.dec.detailsViewType == ObjectDetailsViewType.Tabular;
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

        changed(e: ItemChangeEventArg) {
            main.dispatchStoreModify(this, {
                type: ChangeType.EditProp,
                prop: e.prop,
                value: e.val,
                item: e.item,
                uri: this.uri,
                vue: e.vue
            } as StateChange);
        }

        getProps(group: string) {
            return this.dec.properties.filter(prop => {
                if (prop.properties)
                    return group == prop.title;
                else
                    return prop.group == group;
            });
        }

        get sideMenuVisible() {
            return this.sideMenu && this.root && (!this.dec.detailsViewType ||
                this.dec.detailsViewType == ObjectDetailsViewType.Grouped ||
                this.dec.detailsViewType == ObjectDetailsViewType.Tabular);
        }

        get sideMenu() {
            let menus = [];
            for (const grp of this.groups) {
                menus.push({uri: "#gp-" + grp.replace(/\s/g, "-"), title: grp});
            }
            if (menus.length <= 1) menus = null;
            return menus;
        }

        get item() {
            return this.$store.state.data[this.uri];
        }

        get groups() {
            let props = this.dec.properties.filter((p) => {
                return p.condition == null || main.evalExpression(this.item, p.condition);
            });
            return props.map((p) => {
                return p.group;
            }).filter(main.onlyUnique);
        }
    }
</script>

<style lang="scss">

    .details-view {
        scroll-behavior: smooth;
        min-width: 100%;

        .sidenav {
            background-color: white;
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
            border-radius: 2px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
            /*color: rgba(0, 0, 0, 0.54);*/
            margin-bottom: 12px;
            margin-left: auto;
            margin-right: auto;
            outline: none;
            position: relative;
            padding: 30px;
        }

        .active {
            font-weight: 500;
            background-color: #eee;
            border-left: 3px solid var(--link-color);
            margin-left: -3px;
        }
    }
</style>
