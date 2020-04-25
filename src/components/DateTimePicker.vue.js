"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const Function_vue_1 = tslib_1.__importDefault(require("@/components/Function.vue"));
const RollPicker_vue_1 = tslib_1.__importDefault(require("@/components/RollPicker.vue"));
let DateTimePicker = class DateTimePicker extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.years = [];
        this.months = [];
        this.days = [];
        this.yearCaption = "";
        this.monthCaption = "";
        this.hours = [];
        this.minutes = [];
        this.seconds = [];
        this.amPm = [];
    }
    today() {
        this.date = moment();
        this.makeParts();
        this.$forceUpdate();
    }
    yearChanged(e) {
        this.date = this.date.year(e.index + 1900);
        this.makeDays();
        this.$forceUpdate();
    }
    monthChanged(e) {
        this.date = this.date.month(e.index);
        this.monthCaption = moment.months()[e.index];
        this.makeDays();
        this.$forceUpdate();
    }
    dayChanged(e) {
        this.date = this.date.date(e.index + 1);
        this.dayCaption = moment.weekdays()[this.date.day()];
        this.$forceUpdate();
    }
    hourChanged(e) {
        this.date = this.date.hour(e.index);
        this.$forceUpdate();
    }
    minuteChanged(e) {
        this.date = this.date.minute(e.index);
        this.$forceUpdate();
    }
    secondChanged(e) {
        this.date = this.date.second(e.index);
        this.$forceUpdate();
    }
    ampmChanged(e) {
        this.date = this.date.hour(e.index == 0 ? this.date.hour % 12 : 12 + this.date.hour % 12);
        this.$forceUpdate();
    }
    makeYears() {
        let start, end;
        if (/YY/.test(this.format)) {
            this.yearCaption = "";
            start = 1900;
            end = 2050;
        }
        else {
            this.years = null;
            return;
        }
        this.years = [];
        for (let i = start; i < end; i++) {
            this.years.push(this.addZero(i.toString()));
        }
    }
    makeMonths() {
        if (/M/.test(this.format)) {
            this.monthCaption = moment.months()[this.date.month()];
            this.months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        }
        else {
            this.months = null;
            return;
        }
    }
    makeDays() {
        if (/D/.test(this.format)) {
            this.days = [];
            for (let i = 1; i <= this.date.daysInMonth(); i++) {
                this.days.push(i.toString());
            }
            this.dayCaption = moment.weekdays()[this.date.day()];
        }
        else {
            this.days = null;
        }
    }
    makeHours() {
        if (/H/.test(this.format)) {
            this.hours = [];
            for (let i = 0; i < 24; i++) {
                this.hours.push(this.addZero(i.toString()));
            }
        }
        else if (/h/.test(this.format)) {
            this.hours = [];
            for (let i = 0; i < 12; i++) {
                this.hours.push(this.addZero(i.toString()));
            }
            this.amPm = ["AM", "PM"];
        }
        else {
            this.hours = null;
        }
    }
    makeMinutes() {
        if (/m/.test(this.format)) {
            this.minutes = [];
            for (let i = 0; i < 60; i++) {
                this.minutes.push(this.addZero(i.toString()));
            }
        }
        else {
            this.minutes = null;
        }
    }
    makeSeconds() {
        if (/s/i.test(this.format)) {
            this.seconds = [];
            for (let i = 0; i < 60; i++) {
                this.seconds.push(this.addZero(i.toString()));
            }
        }
        else {
            this.seconds = null;
        }
    }
    addZero(num) {
        return num < 10 ? '0' + num : num;
    }
    created() {
        this.date = this.value ? moment(this.value, this.format) : moment();
        this.makeParts();
    }
    makeParts() {
        this.makeYears();
        this.makeMonths();
        this.makeDays();
        this.makeHours();
        this.makeMinutes();
        this.makeSeconds();
    }
    changed() {
        return { value: this.date.toDate() };
    }
    cancel() {
        return {};
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DateTimePicker.prototype, "format", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], DateTimePicker.prototype, "value", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], DateTimePicker.prototype, "changed", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('canceled')
], DateTimePicker.prototype, "cancel", null);
DateTimePicker = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: { RollPicker: RollPicker_vue_1.default, Function: Function_vue_1.default } })
], DateTimePicker);
exports.default = DateTimePicker;
//# sourceMappingURL=DateTimePicker.vue.js.map