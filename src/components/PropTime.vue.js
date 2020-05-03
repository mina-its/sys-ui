"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("../main"));
let PropTime = class PropTime extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.showPicker = false;
    }
    update(e) {
        let val = e.target.value ? moment(e.target.value, this.format) : null;
        let date = val && val.isValid() ? val.toDate() : null;
        if (!date && e.target.value) {
            main.notify('invalid-date' + ": " + e.target.value, types_1.LogType.Error);
            this.$forceUpdate();
        }
        else
            this.changed({ value: date });
    }
    changed(val) {
        this.showPicker = false;
        return { prop: this.prop, val: val.value, vue: this };
    }
    get datePick() {
        return /D/.test(this.format) || /Y/.test(this.format);
    }
    canceled() {
        this.showPicker = false;
    }
    click() {
        this.showPicker = true;
    }
    get format() {
        if (this.prop.time) {
            if (this.prop.time.customFormat)
                return this.prop.time.customFormat;
            else if (this.prop.time.format) {
                switch (this.prop.time.format) {
                    case types_1.TimeFormat.YearMonthDayHourMinute:
                        return "DD/MM/YYYY - HH:mm";
                    case types_1.TimeFormat.DateWithDayOfWeek:
                        return "DD/MM/YYYY";
                    case types_1.TimeFormat.HourMinute:
                        return "HH:mm";
                }
            }
        }
        return "DD/MM/YYYY";
    }
    get value() {
        let val = this.doc[this.prop.name];
        return val ? moment(val).format(this.format) : "";
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
    vue_property_decorator_1.Prop()
], PropTime.prototype, "readOnly", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropTime.prototype, "changed", null);
PropTime = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropTime', components: {} })
], PropTime);
exports.default = PropTime;
//# sourceMappingURL=PropTime.vue.js.map