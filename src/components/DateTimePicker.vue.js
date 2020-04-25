"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const Function_vue_1 = tslib_1.__importDefault(require("@/components/Function.vue"));
const RollPicker_vue_1 = tslib_1.__importDefault(require("@/components/RollPicker.vue"));
let DateTimePicker = class DateTimePicker extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.format = "YY/MMM/DD HH:mm:ss";
        this.yearCaption = "";
        this.monthCaption = "";
        this.years = [];
        this.months = [];
        this.days = [];
        this.hours = [];
        this.minutes = [];
        this.seconds = [];
        this.amPm = [];
    }
    today() {
        this.date = moment();
    }
    dayChanged(e) {
        if (e.index != this.date.date()) {
            console.log(this.date.toString());
            this.date = this.date.date(e.index);
            console.log(this.date.toString());
            this.dayLabel = moment.weekdays()[this.date.day()];
        }
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
        if (/MMM/.test(this.format)) {
            this.monthCaption = "";
            this.months = moment.monthsShort();
        }
        else if (/M/.test(this.format)) {
            this.yearCaption = "Year";
            this.monthCaption = "Month";
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
            for (let i = 1; i < this.date.daysInMonth(); i++) {
                this.days.push(i.toString());
            }
            this.dayLabel = moment.weekdays()[this.date.day()];
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
        if (/m/i.test(this.format)) {
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
        this.date = this.value ? moment(this.value) : moment();
        this.makeYears();
        this.makeMonths();
        this.makeDays();
        this.makeHours();
        this.makeMinutes();
        this.makeSeconds();
    }
    changed() {
        return { value: this.date };
    }
    cancel() {
        return {};
    }
};
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