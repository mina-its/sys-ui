"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"h-100 d-flex flex-column flex-fill overflow-auto" >
    v - ;
if ( = "root")
    : class {
    }
"{'d-flex p-2 btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}";
role = "toolbar";
aria - label;
"Toolbar with button groups" >
    />
    < ToolbarModifyButtons /  >
    class {
    };
"mr-auto" > /div>
    < div;
class {
}
"mx-2";
role = "group" >
    v - ;
for ( = "func in headFuncs"; ; )
    : key = "func._id";
styles = "btn-primary";
name = "func.name";
"func.exec";
title = "func.title" /  >
    /div>
    < Function;
styles = "text-secondary fa-cog fa-lg";
name = "clickTitlePin";
"clickTitlePin" /  >
    /div>
    < div;
class {
}
"main-body w-100 h-100 overflow-auto d-flex" >
;
class {
}
"{'d-flex overflow-auto details-view':true, 'bg-white':!root}";
"onScroll()" >
    v - ;
if ( = "sideMenuVisible")
    class {
    }
"border-right separator-line sidenav p-2 py-4 d-none d-md-block" >
;
class {
}
"{'nav flex-column tree':1, 'pr-5':ltr, 'pl-5':rtl}";
id = "menus" >
    v - ;
for ( = "item in sideMenu"; class {
} = "nav-item" >
; )
"selectGroup(item)";
class {
}
"{'text-nowrap text-secondary nav-link': 1, 'pr-5':ltr, 'pl-5':rtl, 'active': $data.currentGroup===item.title}";
href = "javascript:void(0);" > {};
{
    item.title;
}
/a>
    < /li>
    < /ul>
    < /aside>
    < div;
class {
}
"{'p-4':root, 'border rounded': !root && dec.detailsViewType===2}" >
    v - ;
if ( = "groupVisible(group)")
    : class {
    }
"groupPanelStyle(group)";
v - ;
for ( = "group in groups"; ; )
    : id = "getGroupId(group)" >
        v - ;
if ( = "groupHeadVisible(group)")
    class {
    }
"text-secondary mb-4" > {};
{
    group;
}
/h3>
    < div;
class {
}
"group" >
;
readonly = "!(dec.access&2)";
v - ;
for ( = "prop in getProps(group)"; ; )
    : key = "prop.name";
item = "item";
prop = "prop";
"changed";
viewType = "2" > /Property>
    < /div>
    < /div>
    < div;
v - ;
if ( = "nonGroupVisible()")
    : class {
    }
"{'gp':root}" >
    v - ;
for ( = "prop in dec.properties"; ; )
    : key = "prop.name";
item = "item";
prop = "prop";
"changed";
viewType = "2" > /Property>
    < /div>
    < div;
v - ;
if ( = "root")
    class {
    }
"h-25" > /div>
    < /div>
    < /div>
    < /div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const types_1 = require("@/types");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_2 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
const uuid_1 = require("uuid");
let DetailsView = class DetailsView extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.currentGroup = this.groups[0];
        this.headFuncs = [];
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
            this.headFuncs = [];
            if (this.dec.links)
                for (const link of this.dec.links) {
                    this.headFuncs.push({
                        title: link.title,
                        name: link.address["$oid"],
                        exec: this.execLink
                    });
                }
        }
        this.reloadLastGroup();
    }
    clickTitlePin(e) {
        let items = [
            { ref: "print", title: main_1.$t('print') }
        ];
        main.showCmenu(null, items, e.event, (state, item) => {
            switch (item.ref) {
                case "print":
                    window.print();
                    break;
            }
        });
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
        // history.pushState(null, null, item.ref);
        if (this.dec.detailsViewType == types_2.ObjectDetailsViewType.Tabular) {
            let $dv = $(".details-view");
            $dv.animate({
                scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
            }, 0);
        }
        let props = this.getProps(this.currentGroup);
        if (props && props.length == 1 && props[0].isList) {
            this.headFuncs = [
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
            this.headFuncs = [];
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
    vue_property_decorator_1.Component({ name: 'DetailsView', components: {} })
], DetailsView);
exports.default = DetailsView;
/script>
    < style;
lang = "scss" >
        .details - view;
{
    scroll - behavior;
    smooth;
    min - width;
    100 % ;
    sidenav;
    {
        background - color;
        white;
    }
    label;
    {
        color: var ;
        (--form - label);
        font - weight;
        600;
    }
    input;
    {
        border - color;
        var ;
        (--grid - border);
    }
    gp;
    {
        background: #fff;
        border - radius;
        2;
        px;
        box - shadow;
        0;
        1;
        px;
        1;
        px;
        0;
        rgba(0, 0, 0, 0.14), 0;
        2;
        px;
        1;
        px - 1;
        px;
        rgba(0, 0, 0, 0.12), 0;
        1;
        px;
        3;
        px;
        0;
        rgba(0, 0, 0, 0.2);
        /*color: rgba(0, 0, 0, 0.54);*/
        margin - bottom;
        12;
        px;
        margin - left;
        auto;
        margin - right;
        auto;
        outline: none;
        position: relative;
        padding: 30;
        px;
    }
    active;
    {
        font - weight;
        500;
        background - color;
        #eee;
        border - left;
        3;
        px;
        solid;
        var ;
        (--link - color);
        margin - left;
        -3;
        px;
    }
}
/style>;
//# sourceMappingURL=DetailsView.vue.js.map