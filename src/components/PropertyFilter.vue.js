"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const types_2 = require("@/types");
const main_1 = require("@/main");
let PropertyFilter = class PropertyFilter extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.filterOperator = null;
    }
    render(ce) {
        let $this = this;
        let propTitle = ce(this.allowPropChange ? 'a' : 'div', {
            attrs: { "class": "filter-prop-title p-1" + (this.allowPropChange ? '' : ' font-weight-bold'), "href": "javascript:void(0);" },
            on: { click: $this.changeFilterProp }
        }, this.prop.title || this.prop.name);
        let propOper = ce('a', {
            attrs: { "class": "filter-prop-oper mx-1 py-1 px-2 bg-light rounded border text-dark font-weight-bold", "href": "javascript:void(0);" },
            on: { click: $this.changeOperator }
        }, main_1.$t(`opr-${this.filterOperator}`));
        let propValue = this.renderValue(ce, `filter-prop-value d-flex align-items-center px-1 border-0`);
        return ce('div', { attrs: { "class": "d-flex align-self-center" } }, [propTitle, propOper, propValue]);
    }
    onPropChanged(val, oldVal) {
        this.filterOperator = this.catchOperator();
    }
    mounted() {
        this.filterOperator = this.catchOperator();
    }
    changed(e) {
        if (!this.prop._.isRef && (this.prop._.gtype == types_1.GlobalType.string || this.prop._.gtype == types_1.GlobalType.number))
            return;
        this.raiseChanged(e);
    }
    raiseChanged(e) {
        let filterVal = e.filterVal;
        if (e.val != null) {
            switch (this.filterOperator) {
                case types_2.FilterOperator.Like:
                    filterVal = { "$reg": "/" + e.val + "/i" };
                    break;
                case types_2.FilterOperator.StartWith:
                    filterVal = { "$reg": "/^" + e.val + "/i" };
                    break;
                case types_2.FilterOperator.EndWith:
                    filterVal = { "$reg": "/" + e.val + "$/i" };
                    break;
                case types_2.FilterOperator.Yes:
                    filterVal = true;
                    break;
                case types_2.FilterOperator.No:
                    filterVal = { "$ne": true };
                    break;
                case types_2.FilterOperator.NotEqual:
                    filterVal = { "$ne": e.val };
                    break;
                case types_2.FilterOperator.GreaterThan:
                    filterVal = { "$gt": e.val };
                    break;
                case types_2.FilterOperator.GreaterThanEqual:
                    filterVal = { "$gte": e.val };
                    break;
                case types_2.FilterOperator.LessThan:
                    filterVal = { "$lt": e.val };
                    break;
                case types_2.FilterOperator.LessThanEqual:
                    filterVal = { "$lte": e.val };
                    break;
                case types_2.FilterOperator.In:
                    filterVal = { "$in": e.val };
                    break;
                case types_2.FilterOperator.NotIn:
                    filterVal = { "$nin": e.val };
                    break;
                case types_2.FilterOperator.Exist:
                    if (this.prop._.gtype == types_1.GlobalType.string)
                        filterVal = { "$reg": "/\\w/" };
                    else
                        filterVal = { "$exists": true };
                    break;
                case types_2.FilterOperator.None:
                    if (this.prop._.gtype == types_1.GlobalType.string)
                        filterVal = { $not: { $reg: "/\\w/" } };
                    else
                        filterVal = { $null: true };
                    break;
                case types_2.FilterOperator.Equal:
                    filterVal = e.val;
                    break;
            }
        }
        return { prop: e.prop, val: e.val, filterVal };
    }
    keydown(e) {
        if (e.event.keyCode == types_1.Keys.enter) {
            let val;
            if (this.prop._.gtype == types_1.GlobalType.string)
                val = e.event.target.value.trim();
            else if (this.prop._.gtype == types_1.GlobalType.number)
                val = e.event.target.value.trim();
            else
                val = this.filterDoc[this.prop.name];
            if (val === "")
                val = null;
            this.raiseChanged({ prop: this.prop, val });
        }
    }
    changeFilterProp(e) {
        return e;
    }
    catchOperator() {
        let val = this.filterDoc[this.prop.name];
        let filterVal = this.filter[this.prop.name];
        if (filterVal) {
            if (filterVal.$reg) {
                if (/^\/\^/.test(filterVal.$reg))
                    return types_2.FilterOperator.StartWith;
                else if (/\$\/i?$/.test(filterVal.$reg))
                    return types_2.FilterOperator.EndWith;
                else if (/\/\\w\//.test(filterVal.$reg))
                    return types_2.FilterOperator.Exist;
                else
                    return types_2.FilterOperator.Like;
            }
            else if (filterVal.$not && filterVal.$not.$reg) {
                if (/\/\\w\//.test(filterVal.$not.$reg))
                    return types_2.FilterOperator.None;
            }
            else if (filterVal.$gt)
                return types_2.FilterOperator.GreaterThan;
            else if (filterVal.$gte)
                return types_2.FilterOperator.GreaterThanEqual;
            else if (filterVal.$lt)
                return types_2.FilterOperator.LessThan;
            else if (filterVal.$lte)
                return types_2.FilterOperator.LessThanEqual;
            else if (filterVal.$in)
                return types_2.FilterOperator.In;
            else if (filterVal.$ne === true)
                return types_2.FilterOperator.No;
            else if (filterVal.$ne)
                return types_2.FilterOperator.NotEqual;
            else if (filterVal.$nn)
                return types_2.FilterOperator.NotNull;
            else if (filterVal.$null)
                return types_2.FilterOperator.None;
            else if (filterVal.$exists)
                return types_2.FilterOperator.Exist;
            else if (filterVal.$nin)
                return types_2.FilterOperator.NotIn;
            else if (typeof filterVal == "string")
                return types_2.FilterOperator.Equal;
            else if (filterVal === true)
                return types_2.FilterOperator.Yes;
            else
                return types_2.FilterOperator.Equal;
        }
        else {
            if (this.prop._.isRef)
                return types_2.FilterOperator.Equal;
            else {
                switch (this.prop._.gtype) {
                    case types_1.GlobalType.boolean:
                        return val === true ? types_2.FilterOperator.Yes : (val === false ? types_2.FilterOperator.No : types_2.FilterOperator.Select);
                    case types_1.GlobalType.string:
                        return types_2.FilterOperator.Like;
                }
            }
            return types_2.FilterOperator.Equal;
        }
    }
    changeOperator(e) {
        let oprs;
        if (this.prop._.isRef) {
            oprs = [types_2.FilterOperator.Equal, types_2.FilterOperator.NotEqual, types_2.FilterOperator.None, types_2.FilterOperator.Exist];
        }
        else {
            switch (this.prop._.gtype) {
                case types_1.GlobalType.string:
                    oprs = [types_2.FilterOperator.Like, types_2.FilterOperator.Equal, types_2.FilterOperator.NotEqual, types_2.FilterOperator.StartWith, types_2.FilterOperator.EndWith, types_2.FilterOperator.None, types_2.FilterOperator.Exist];
                    break;
                case types_1.GlobalType.number:
                    oprs = [types_2.FilterOperator.Equal, types_2.FilterOperator.NotEqual, types_2.FilterOperator.GreaterThan, types_2.FilterOperator.GreaterThanEqual, types_2.FilterOperator.LessThan, types_2.FilterOperator.LessThanEqual, types_2.FilterOperator.None, types_2.FilterOperator.Exist];
                    break;
                case types_1.GlobalType.time:
                    oprs = [types_2.FilterOperator.Equal, types_2.FilterOperator.NotEqual, types_2.FilterOperator.Null, types_2.FilterOperator.NotNull, types_2.FilterOperator.GreaterThan, types_2.FilterOperator.GreaterThanEqual, types_2.FilterOperator.None, types_2.FilterOperator.Exist];
                    break;
                case types_1.GlobalType.boolean:
                    oprs = [types_2.FilterOperator.Select, types_2.FilterOperator.Yes, types_2.FilterOperator.No];
                    break;
                default:
                    oprs = [types_2.FilterOperator.None, types_2.FilterOperator.Exist];
                    break;
            }
        }
        let items = oprs.map(opr => {
            return { ref: opr, title: main_1.$t(`opr-${opr}`) };
        });
        main_1.showCmenu(this, items, e, (state, item) => {
            if (item) {
                state.filterOperator = item.ref;
                let val = this.filterDoc[this.prop.name];
                switch (state.filterOperator) {
                    case types_2.FilterOperator.No:
                    case types_2.FilterOperator.Exist:
                    case types_2.FilterOperator.None:
                    case types_2.FilterOperator.Yes:
                        val = "";
                        break;
                    default:
                        val = val || null; // if just switch from not parametric props must be empty
                        break;
                }
                this.raiseChanged({ prop: this.prop, val });
            }
        });
    }
    renderValue(ce, styles) {
        if (this.filterOperator == types_2.FilterOperator.None || this.filterOperator == types_2.FilterOperator.Exist ||
            this.filterOperator == types_2.FilterOperator.Null || this.filterOperator == types_2.FilterOperator.NotNull || this.filterDoc == null)
            return null;
        let pr = {
            doc: this.filterDoc, name: this.prop.name, prop: this.prop, viewType: types_1.ObjectViewType.Filter,
            styles, readOnly: false
        };
        if (this.prop._.isRef)
            return ce('prop-reference', {
                attrs: { "class": "prop-reference " + styles },
                on: { changed: this.changed, keydown: this.keydown },
                props: pr,
            });
        switch (this.prop._.gtype) {
            case types_1.GlobalType.string:
                return ce('prop-text', {
                    attrs: { type: 'text', "class": styles },
                    on: { changed: this.changed, keydown: this.keydown },
                    props: pr,
                });
            case types_1.GlobalType.number:
                return ce('prop-text', {
                    attrs: { type: 'number', "class": styles },
                    on: { changed: this.changed, keydown: this.keydown },
                    props: pr,
                });
            case types_1.GlobalType.time:
                return ce('prop-time', {
                    attrs: { "class": "prop-time " + styles },
                    on: { changed: this.changed, keydown: this.keydown },
                    props: pr,
                });
            case types_1.GlobalType.location:
                return ce('prop-location', {
                    on: { changed: this.changed, keydown: this.keydown },
                    props: pr,
                });
        }
        return null;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropertyFilter.prototype, "filter", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropertyFilter.prototype, "filterDoc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropertyFilter.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropertyFilter.prototype, "allowPropChange", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Watch('prop')
], PropertyFilter.prototype, "onPropChanged", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit("changed")
], PropertyFilter.prototype, "raiseChanged", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changeFilterProp')
], PropertyFilter.prototype, "changeFilterProp", null);
PropertyFilter = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropertyFilter', components: {} })
], PropertyFilter);
exports.default = PropertyFilter;
//# sourceMappingURL=PropertyFilter.vue.js.map