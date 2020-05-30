"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_2 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
const uuid_1 = require("uuid");
let DetailsView = /** @class */ (() => {
    let DetailsView = class DetailsView extends vue_property_decorator_1.Vue {
        constructor() {
            super(...arguments);
            this.currentGroup = this.groups[0];
            this.headFuncs = [];
        }
        isNotAloneInlineDataGridProperty(group, prop) {
            return prop._.gtype == types_2.GlobalType.object && prop.isList && (this.level > 0);
        }
        groupPanelStyle(group) {
            let style = this.dec.detailsViewType === types_2.ObjectDetailsViewType.Tabular ? 'py-4' : "";
            let props = this.getProps(group);
            if (props && props.length == 1) {
                let theProp = props[0];
                if (theProp.isList) {
                    if (theProp.listsViewType == types_2.ObjectListsViewType.Card)
                        return "";
                    else if (!this.level)
                        return "grid-view-box";
                }
            }
            if (!this.level)
                style += " gp";
            return style;
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
            this.resetHeadFuncs();
            this.reloadLastGroup();
        }
        refresh() {
            main.load(location.pathname, false);
        }
        clickObjectMenu(e) {
            let items = [
                { ref: "print", title: main_1.$t('print') }
            ];
            main.showCmenu(null, items, e, (state, item) => {
                switch (item.ref) {
                    case "print":
                        window.print();
                        break;
                }
            });
        }
        getGroupId(group) {
            if (!this.level)
                return 'gp-' + group.replace(/\s/g, '-');
            else
                return undefined;
        }
        onPropertyChanged(value, oldValue) {
            this.currentGroup = this.groups[0];
        }
        saveLastGroup(item) {
            if (typeof (Storage) === "undefined")
                return;
            localStorage.setItem("_gp" + location.pathname, JSON.stringify(item));
        }
        reloadLastGroup() {
            if (typeof (Storage) === "undefined")
                return;
            let item = localStorage.getItem("_gp" + location.pathname);
            if (item)
                this.selectGroup(JSON.parse(item));
            else
                this.currentGroup = this.groups[0];
        }
        selectGroup(item) {
            this.currentGroup = item.title;
            this.saveLastGroup(item);
            if (this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular) {
                let $dv = $(".details-view");
                $dv.animate({ scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top }, 0);
            }
            let props = this.getProps(this.currentGroup);
            let newItemLink = this.headFuncs.find(i => i.name == "new-item");
            if (newItemLink)
                this.headFuncs.splice(this.headFuncs.indexOf(newItemLink), 1);
            // The Group is a list property
            if (props && props.length == 1 && props[0].isList) {
                let prop = props[0];
                switch (prop.referType) {
                    case types_2.PropertyReferType.inlineData:
                        let title = main_1.getNewItemTitle(prop.title);
                        this.headFuncs.push({
                            title, name: "new-item",
                            exec: () => {
                                let uri = this.uri + "/" + prop.name;
                                let dec = main_1.glob.form.declarations[uri];
                                let newItem = { _id: uuid_1.v4(), _: { marked: false, dec } };
                                this.dec.properties.forEach(p => newItem[p.name] = null);
                                // if (this.dec.reorderable)
                                //     newItem['_z'] = (Math.max(...val.map(item => item._z)) || 0) + 1;
                                if (this.data) {
                                    this.data[uri].push(newItem);
                                }
                                else
                                    main.dispatchStoreModify(this, {
                                        type: types_1.ChangeType.InsertItem,
                                        item: newItem,
                                        uri,
                                        vue: this
                                    });
                            }
                        });
                        break;
                    case types_2.PropertyReferType.outbound:
                        let items = this.item[prop.name];
                        if (items == null)
                            main_1.loadOutboundData(prop, this.item);
                        break;
                }
            }
        }
        nonGroupVisible() {
            return this.groups.length <= 1;
        }
        groupVisible(group) {
            if (this.groups.length <= 1)
                return false;
            if (!this.level)
                return this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular || this.currentGroup == group;
            else
                return true;
        }
        groupHeadVisible(group) {
            let props = this.getProps(group);
            // if (props && props.length == 1 && props[0].isList) return true;
            return !this.level && this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular;
        }
        onScroll() {
            main.hideCmenu();
        }
        execLink(cn) {
            let data = { data: this.item };
            main.ajax("/" + cn.name, data, null, main.handleResponse, (err) => {
                main.notify(err);
            });
        }
        emitChanged(e) {
            return e;
        }
        changed(e) {
            if (this.data) {
                e.vue.$set(e.item, e.prop.name, e.val);
                this.emitChanged(e);
            }
            else
                main.dispatchStoreModify(this, {
                    type: types_1.ChangeType.EditProp,
                    prop: e.prop,
                    value: e.val,
                    item: e.item,
                    uri: this.uri,
                    vue: e.vue
                });
            // Check the properties which are depends to the changed property
            let dependents = this.dec.properties.filter(p => p.dependsOn && p.dependsOn.split(',').indexOf(e.prop.name) > -1 && this.item[e.prop.name] != null);
            for (const prop of dependents) {
                this.changed({ item: this.item, prop, val: null, vue: this });
                // if (prop._.items) {
                //     prop._.items = null;
                //     let data = {prop, instance};
                //     ajax('/getPropertyReferenceValues', data, null, res => prop._.items = res.data, err => notify(err));
                // }
            }
        }
        getProps(group) {
            return this.dec.properties.filter(prop => {
                if (prop.properties)
                    return group == prop.title;
                else
                    return prop.group == group;
            });
        }
        get sideMenuVisible() {
            return this.sideMenu && !this.level && (!this.dec.detailsViewType ||
                this.dec.detailsViewType == types_2.ObjectDetailsViewType.Grouped ||
                this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular);
        }
        get sideMenu() {
            let menus = [];
            for (const grp of this.groups) {
                menus.push({ uri: "#gp-" + grp.replace(/\s/g, "-"), title: grp });
            }
            if (menus.length <= 1)
                menus = null;
            return menus;
        }
        get item() {
            if (this.data) // when we explicitly specify the data
                return this.data;
            else
                return this.$store.state.data[this.uri];
        }
        get groups() {
            this.dec.properties.forEach(p => {
                if (p.condition) {
                    console.log(p.condition);
                }
            });
            let props = this.dec.properties.filter(p => p.condition == null || main.evalExpression(this.item, p.condition));
            return props.map(p => p.group).filter(main.onlyUnique);
        }
    };
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], DetailsView.prototype, "uri", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], DetailsView.prototype, "data", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], DetailsView.prototype, "dec", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], DetailsView.prototype, "level", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Watch('uri')
    ], DetailsView.prototype, "onPropertyChanged", null);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('changed')
    ], DetailsView.prototype, "emitChanged", null);
    DetailsView = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'DetailsView', components: {} })
    ], DetailsView);
    return DetailsView;
})();
exports.default = DetailsView;
//# sourceMappingURL=DetailsView.vue.js.map