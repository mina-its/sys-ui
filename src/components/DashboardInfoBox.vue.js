"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"info-box d-flex" >
    class {
    };
"info-box-icon flex-column";
style = "{'background-color': color}" >
;
class {
}
"`fa ${icon}`" > /i>
    < /span>
    < div;
class {
}
"p-2 flex-column" >
    class {
    };
"info-box-text" > {};
{
    title;
}
/div>
    < div;
class {
}
"info-box-number font-weight-bold" > {};
{
    value;
}
/div>
    < /div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
let DashboardInfoBox = class DashboardInfoBox extends vue_property_decorator_1.Vue {
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DashboardInfoBox.prototype, "color", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DashboardInfoBox.prototype, "title", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DashboardInfoBox.prototype, "value", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DashboardInfoBox.prototype, "icon", void 0);
DashboardInfoBox = tslib_1.__decorate([
    vue_property_decorator_1.Component
], DashboardInfoBox);
exports.default = DashboardInfoBox;
/script>
    < style;
lang = "scss" >
        .info - box;
{
    display: block;
    min - height;
    90;
    px;
    background: #fff;
    width: 100 % ;
    box - shadow;
    0;
    1;
    px;
    1;
    px;
    rgba(0, 0, 0, 0.1);
    border - radius;
    2;
    px;
    margin - bottom;
    15;
    px;
    info - box - icon;
    {
        border - top - left - radius;
        2;
        px;
        border - top - right - radius;
        0;
        border - bottom - right - radius;
        0;
        border - bottom - left - radius;
        2;
        px;
        display: block;
        float: left;
        color: white;
        height: 90;
        px;
        width: 90;
        px;
        text - align;
        center;
        font - size;
        45;
        px;
        line - height;
        90;
        px;
        background: rgba(0, 0, 0, 0.2);
    }
    info - box - text;
    {
        white - space;
        nowrap;
        min - width;
        100;
        px;
    }
}
/style>;
//# sourceMappingURL=DashboardInfoBox.vue.js.map