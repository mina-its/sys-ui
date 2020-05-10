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
        this.filterOperator = types_2.FilterOperator.Like;
    }
    render(ce) {
        let $this = this;
        let propTitle = ce(this.allowPropChange ? 'a' : 'div', {
            attrs: { "class": "filter-prop-title p-1" + (this.allowPropChange ? '' : ' font-weight-bold'), "href": "javascript:void(0);" },
            on: { click: $this.changeFilterProp }
        }, this.prop.title || this.prop.name);
        let propOper = ce('a', {
            attrs: { "class": "filter-prop-oper mx-1 py-1 px-2 bg-light rounded border text-dark font-weight-bold", "href": "javascript:void(0);" },
            on: { click: $this.filterOperClick }
        }, main_1.$t(`opr-${this.filterOperator}`));
        let propValue = this.renderValue(ce, `filter-prop-value px-1 border-0`);
        return ce('div', { attrs: { "class": "d-flex align-self-center" } }, [propTitle, propOper, propValue]);
    }
    changed(e) {
        if (this.prop._.gtype == types_1.GlobalType.string)
            return;
        this.raiseChanged(e);
    }
    raiseChanged(e) {
        let filterVal = null;
        if (e.val != null) {
            switch (this.filterOperator) {
                case types_2.FilterOperator.Like:
                    filterVal = { "$reg": e.val };
                    break;
            }
        }
        return { prop: e.prop, val: e.val, filterVal };
    }
    keydown(e) {
        if (e.event.keyCode == types_1.Keys.enter) {
            let val;
            if (this.prop._.gtype == types_1.GlobalType.string)
                val = e.event.target.value;
            else
                val = this.filterDoc[this.prop.name];
            this.raiseChanged({ prop: this.prop, val });
        }
    }
    changeFilterProp(e) {
        return e;
    }
    filterOperClick(e) {
        let oprs = ["nn", "nl"];
        switch (this.prop._.gtype) {
            case types_1.GlobalType.string:
                oprs = [types_2.FilterOperator.Like, "eq", "ne", "nn", "nl"];
                break;
            case types_1.GlobalType.number:
                oprs = ["eq", "ne", "gt", "gte", "lt", "lte", "nn", "nl"];
                break;
            case types_1.GlobalType.time:
                oprs = ["eq", "ne", "dge", "dle", "gt", "gte", "lt", "lte", "nn", "nl"];
                break;
        }
        let items = oprs.map(opr => {
            return { ref: opr, title: main_1.$t(`opr-${opr}`) };
        });
        main_1.showCmenu(this, items, e, (state, item) => {
            if (item) {
                state.filterOperator = item.ref;
            }
        });
    }
    renderValue(ce, styles) {
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
            case types_1.GlobalType.boolean:
                return ce('prop-boolean', {
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