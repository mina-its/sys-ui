"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
;
class {
}
"{'highlight': meta.marked}";
"click" >
    scope;
"row";
v - ;
if ( = "selectable")
    class {
    }
"text-center" >
;
checked = "meta.marked" > /CheckBox>
    < /th>
    < th;
v - ;
"headerClick";
class {
}
"text-center" > /th>
    < td;
v - ;
for ( = "(pMeta, index) in item._.dec.properties" >
; ; )
"focused";
item = "item";
prop = "pMeta";
"changed";
"keydown";
viewType = "1";
indexInGrid = "index" > /Prop>
    < /td>
    < /tr>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const CheckBox_vue_1 = tslib_1.__importDefault(require("@/components/CheckBox.vue"));
const Prop_vue_1 = tslib_1.__importDefault(require("@/components/Prop.vue"));
let GridViewRow = class GridViewRow extends vue_property_decorator_1.Vue {
    focused(e, prop) {
        jquery_1.default(".prop-focused").removeClass("prop-focused");
        jquery_1.default(e.target).closest("td").addClass("prop-focused");
    }
    changed(e) {
        return e;
    }
    updateStatus() {
        this.meta.marked = event.target.checked;
    }
    headerClick(e) {
        return { item: this.item, event: e };
    }
    click(e) {
        return { item: this.item, event: e };
    }
    keydown(e) {
        return { event: e.event, item: this.item, prop: e.prop };
    }
    get meta() {
        return this.item._;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridViewRow.prototype, "item", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], GridViewRow.prototype, "selectable", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], GridViewRow.prototype, "changed", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('headerClick')
], GridViewRow.prototype, "headerClick", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('selected')
], GridViewRow.prototype, "click", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('keydown')
], GridViewRow.prototype, "keydown", null);
GridViewRow = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: { Prop: Prop_vue_1.default, CheckBox: CheckBox_vue_1.default } })
], GridViewRow);
exports.default = GridViewRow;
/script>
    < style;
lang = "scss" >
    tbody;
{
    tr;
    {
        td: nth - child(2);
        {
            white - space;
            nowrap;
        }
            & ;
        hover;
        td;
        {
            background - color;
            var ;
            (--grid - row - hover);
        }
            & .highlight;
        td;
        {
            background - color;
            var ;
            (--grid - row - highlight);
        }
            & ;
        hover;
        th,  & .highlight;
        th;
        {
            background - color;
            var ;
            (--grid - row - header - highlight);
        }
    }
}
/style>;
//# sourceMappingURL=GridViewRow.vue.js.map