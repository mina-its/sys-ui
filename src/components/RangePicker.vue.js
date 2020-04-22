"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"p-5" >
    class {
    };
"range-picker" >
;
"showMenu";
contenteditable = "true";
class {
}
"" > {};
{
    value;
}
/span>
    < div;
class {
}
"{'context-menu': true, 'd-none': !menuVisible}" >
    UP < /div>
    < div > 2010 < /div>
    < div > 2011 < /div>
    < div > 2012 < /div>
    < div > 2013 < /div>
    < div > Down < /div>
    < /div>
    < /div>
    < span > /</span >
    /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
let RangePicker = class RangePicker extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.menuVisible = false;
    }
    showMenu() {
        this.menuVisible = true;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RangePicker.prototype, "pair", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], RangePicker.prototype, "value", void 0);
RangePicker = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: {} })
], RangePicker);
exports.default = RangePicker;
/script>
    < style;
lang = "scss" >
        .range - picker;
{
    display: inline - block;
    input;
    {
    }
}
/style>;
//# sourceMappingURL=RangePicker.vue.js.map