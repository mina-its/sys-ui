"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_2 = require("../../../sys/src/types");
const main_1 = require("@/main");
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const main = tslib_1.__importStar(require("@/main"));
let DetailsView = class DetailsView extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.currentGroup = this.groups[0];
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
    }
    onPropertyChanged(value, oldValue) {
        this.currentGroup = this.groups[0];
    }
    selectGroup(item) {
        this.currentGroup = item.title;
        history.pushState(null, null, item.ref);
        if (this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular) {
            let $dv = jquery_1.default(".details-view");
            $dv.animate({
                scrollTop: jquery_1.default(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
            }, 0);
        }
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
    vue_property_decorator_1.Component
], DetailsView);
exports.default = DetailsView;
//# sourceMappingURL=DetailsView.vue.js.map