<template>
    <div :class="{'main-body h-100 d-flex flex-column flex-fill overflow-auto':1, 'root': !level}">
        <!--  Toolbar -->
        <div v-if="!level" :class="{'d-flex p-2 align-items-center btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

            <!--  Breadcrumb -->
            <Breadcrumb/>

            <!--  Toolbar Apply/Cancel -->
            <ToolbarModifyButtons/>

            <!--  Head Functions -->
            <div class="mr-auto"></div>
            <template v-for="func in headFuncs">
                <a :href="func.ref" :class="`${func.style||'btn btn-success mx-1 px-2'}`" v-if="func.ref">{{func.title}}</a>
                <Function v-else styles="btn-primary mx-1" :name="func.name" @exec="func.exec" :title="func.title"/>
            </template>

            <!--  Object Menu -->
            <a class="text-secondary px-2" href="javascript:void(0);" @click="clickObjectMenu"><i class="fal fa-cog fa-lg"></i></a>
        </div>

        <!--  Content -->
        <div class="w-100 h-100 overflow-auto d-flex">
            <div :class="{'d-flex overflow-auto details-view':true, 'bg-white':level}" @scroll="onScroll()">

                <!--  Side Menu -->
                <aside v-if="sideMenuVisible" class="border-right separator-line sidenav p-2 py-4 d-none d-md-block">
                    <ul class="nav flex-column" id="menus">
                        <li v-for="item in sideMenu" class="nav-item">
                            <a @click="selectGroup(item)"
                               :class="{'text-nowrap text-secondary nav-link': 1, 'active': $data.currentGroup===item.title}"
                               href="javascript:void(0);">{{item.title}}</a>
                        </li>
                    </ul>
                </aside>

                <!--  Main -->
                <div :class="{'p-4':!level, 'border rounded': level && dec.detailsViewType===2}">
                    <div v-if="groupVisible(group)" :class="groupPanelStyle(group)" v-for="group in groups" :id="getGroupId(group)">
                        <h3 v-if="groupHeadVisible(group)" class="text-secondary mb-4">{{group}}</h3>
                        <div class="group">
                            <template v-for="prop in getProps(group)">
                                <label v-if="isNotAloneInlineDataGridProperty(group, prop, item)" class="prop-label from-outside-label pt-2">{{prop.title}}</label>
                                <Property :level="level?level+1:1" :readonly="!(dec.access&2)" :item="item" :prop="prop" @changed="changed" :viewType="2"/>
                            </template>
                        </div>
                    </div>
                    <div v-if="nonGroupVisible()" :class="{'gp':!level}">
                        <Property :level="level?level+1:1" v-for="prop in dec.properties" :key="prop.name" :item="item" :prop="prop" @changed="changed" :viewType="2"/>
                    </div>
                    <div v-if="!level" class="h-25"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ChangeType, FunctionExecEventArg, HeadFunc, ItemChangeEventArg, JQuery, MenuItem, StateChange} from '@/types';
    import {Component, Prop, Vue, Watch, Emit} from 'vue-property-decorator';
    import {Context, ObjectDec, ObjectDetailsViewType, ObjectListsViewType, EntityMeta, GlobalType} from "../../../sys/src/types";
    import {$t, glob} from '@/main';
    import * as main from '../main';
    import {v4 as uuidv4} from 'uuid';

    declare let $: JQuery;

    @Component({name: 'DetailsView', components: {}})
    export default class DetailsView extends Vue {
        @Prop() private uri: string;
        @Prop() private data: any;
        @Prop() private dec: ObjectDec;
        @Prop() private level: number;

        private currentGroup: string = this.groups[0];
        private headFuncs: HeadFunc[] = [];

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
                this.headFuncs = this.dec.links.filter(link => !link.disable).map(link => {
                    return {title: link.title as string, ref: link.address};
                });
            }
        }

        mounted() {
            this.resetHeadFuncs();
            this.reloadLastGroup();
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
            let newItemLink = this.headFuncs.find(i => i.name == "new-item");
            if (newItemLink) this.headFuncs.splice(this.headFuncs.indexOf(newItemLink), 1);
            if (props && props.length == 1 && props[0].isList) {
                this.headFuncs.push({
                    title: $t("new-item"), name: "new-item", exec: () => {
                        let uri = this.uri + "/" + props[0].name;
                        let dec = glob.form.declarations[uri];
                        let newItem = {_id: uuidv4(), _: {marked: false, dec} as EntityMeta};
                        this.dec.properties.forEach(prop => newItem[prop.name] = null);
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
            return this.sideMenu && !this.level && (!this.dec.detailsViewType ||
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
            if (this.data) // when we explicitly specify the data
                return this.data;
            else
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
