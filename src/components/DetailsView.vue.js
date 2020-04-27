"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_2 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
const ElemProp_vue_1 = tslib_1.__importDefault(require("@/components/ElemProp.vue"));
const uuid_1 = require("uuid");
let DetailsView = class DetailsView extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.currentGroup = this.groups[0];
    }
    groupPanelStyle(group) {
        let style = this.dec.detailsViewType === types_2.ObjectDetailsViewType.Tabular ? 'py-4' : "";
        let props = this.getProps(group);
        if (props && props.length == 1) {
            let theProp = props[0];
            if (theProp.isList) {
                if (theProp.listsViewType == types_2.ObjectListsViewType.Card)
                    return "";
                else if (this.root)
                    return "grid-view-box";
            }
        }
        if (this.root)
            style += " gp";
        return style;
    }
    mounted() {
        if (this.root) {
            main_1.glob.headFuncs = [];
            if (this.dec.links)
                for (const link of this.dec.links) {
                    main_1.glob.headFuncs.push({
                        title: link.title,
                        name: link.address["$oid"],
                        exec: this.execLink
                    });
                }
        }
        this.reloadLastGroup();
    }
    getGroupId(group) {
        if (this.root)
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
    }
    selectGroup(item) {
        this.currentGroup = item.title;
        this.saveLastGroup(item);
        history.pushState(null, null, item.ref);
        if (this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular) {
            let $dv = $(".details-view");
            $dv.animate({
                scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
            }, 0);
        }
        let props = this.getProps(this.currentGroup);
        if (props && props.length == 1 && props[0].isList) {
            main_1.glob.headFuncs = [
                {
                    title: main_1.$t("new-item"), name: "string", exec: () => {
                        let uri = this.uri + "/" + props[0].name;
                        let dec = main_1.glob.form.declarations[uri];
                        let newItem = { _id: uuid_1.v4(), _: { marked: false, dec } };
                        this.dec.properties.forEach(prop => newItem[prop.name] = null);
                        // if (this.dec.reorderable)
                        //     newItem['_z'] = (Math.max(...val.map(item => item._z)) || 0) + 1;
                        main.dispatchStoreModify(this, {
                            type: types_1.ChangeType.InsertItem,
                            item: newItem,
                            uri,
                            vue: this
                        });
                    }
                }
            ];
        }
        else
            main_1.glob.headFuncs = [];
    }
    nonGroupVisible() {
        return this.groups.length <= 1;
    }
    groupVisible(group) {
        if (this.groups.length <= 1)
            return false;
        if (this.root)
            return this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular || this.currentGroup == group;
        else
            return true;
    }
    groupHeadVisible(group) {
        let props = this.getProps(group);
        // if (props && props.length == 1 && props[0].isList) return true;
        return this.root && this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular;
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
    changed(e) {
        main.dispatchStoreModify(this, {
            type: types_1.ChangeType.EditProp,
            prop: e.prop,
            value: e.val,
            item: e.item,
            uri: this.uri,
            vue: e.vue
        });
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
        return this.sideMenu && this.root && (!this.dec.detailsViewType ||
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
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DetailsView.prototype, "uri", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DetailsView.prototype, "root", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DetailsView.prototype, "dec", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Watch('uri')
], DetailsView.prototype, "onPropertyChanged", null);
DetailsView = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'DetailsView', components: { ElemProp: ElemProp_vue_1.default } })
], DetailsView);
exports.default = DetailsView;
//# sourceMappingURL=DetailsView.vue.js.map