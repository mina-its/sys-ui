"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("../main"));
let PropTime = class PropTime extends vue_property_decorator_1.Vue {
    update(e) {
        let val = e.target.value ? moment.utc(e.target.value) : null;
        let date = val && val.isValid() ? val.toDate() : null;
        if (!date && e.target.value) {
            main.notify('invalid-date' + ": " + e.target.value, types_1.LogType.Error);
            this.$forceUpdate();
        }
        else
            this.change(date);
    }
    change(val) {
        return { prop: this.prop, val, vue: this };
    }
    get value() {
        let val = this.doc[this.prop.name];
        return val ? moment(val).format("YYYY/MM/DD") : "";
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTime.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTime.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropTime.prototype, "viewType", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropTime.prototype, "change", null);
PropTime = tslib_1.__decorate([
    vue_property_decorator_1.Component
], PropTime);
exports.default = PropTime;
//# sourceMappingURL=PropTime.vue.js.map