<template>
    <div class="date-time-picker" style="min-width: 20rem">
        <div class="d-flex p-3">
            <RollPicker v-if="days" :caption="dayCaption" @changed="dayChanged" :index="currentDay"
                        :items="days"></RollPicker>
            <RollPicker v-if="months" :caption="monthCaption" @changed="monthChanged" :index="currentMonth"
                        :items="months"></RollPicker>
            <RollPicker v-if="years" :caption="yearCaption" @changed="yearChanged" :index="currentYear"
                        :items="years"></RollPicker>
            <div v-if="hours" class="p-2">&nbsp;</div>
            <RollPicker v-if="hours" caption="" :index="date.hour()" :items="hours" @changed="hourChanged"></RollPicker>
            <div v-if="hours && minutes" class="p-2 align-self-center">:</div>
            <RollPicker v-if="minutes" caption="" :index="date.minute()" :items="minutes"
                        @changed="minuteChanged"></RollPicker>
            <div v-if="minutes && seconds" class="p-2 align-self-center">:</div>
            <RollPicker v-if="seconds" caption="" :index="date.second()" :items="seconds"
                        @changed="secondChanged"></RollPicker>
            <RollPicker v-if="amPm" caption="" :index="0" :items="amPm" @changed="ampmChanged"></RollPicker>
        </div>
        <div class="d-flex w-100">
            <button @click="cancel" class="flex-fill py-2 border">Cancel</button>
<!--            <button @click="today" class="flex-fill py-2 border">Today</button>-->
            <button @click="changed" class="flex-fill py-2 border">Set</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';

    import Jalali = require('jalali-moment');
    import {glob} from "../main";
    import {Constants} from "../types";

    declare let $: any;

    @Component({name: 'JalaliDateTimePicker', components: {}})
    export default class JalaliDateTimePicker extends Vue {
        private format: string;
        private value: Date;

        private date;
        private years = [];
        private months = [];
        private days = [];
        private yearCaption = "";
        private monthCaption = "";
        private dayCaption;
        private hours = [];
        private minutes = [];
        private seconds = [];
        private amPm = null;

        today() {
            this.date = Jalali();
            if (!/s/i.test(this.format))
                this.date.set({second: 0, millisecond: 0});
            if (!/m/.test(this.format))
                this.date.set({minute: 0});
            if (!/H/.test(this.format))
                this.date.set({hour: 0});

            this.makeParts();
            this.$forceUpdate();
        }

        get currentYear() {
            return +this.date.format("jYYYY") - 1300;
        }

        yearChanged(e: { index: number, item }) {
            this.date.year(e.index + 1300);
            this.makeDays();
            this.$forceUpdate();
        }

        get currentMonth() {
            return +this.date.format("jMM") - 1;
        }

        monthChanged(e: { index: number, item }) {
            this.date.month(e.index);
            this.monthCaption = Constants.Jalali_Months[e.index];
            this.makeDays();
            this.$forceUpdate();
        }

        get currentDay() {
            return +this.date.format("jDD") - 1;
        }

        dayChanged(e: { index: number, item }) {
            this.date.date(e.index + 1);
            this.dayCaption = Constants.Jalali_Week_Days[this.date.day()];
            this.$forceUpdate();
        }

        hourChanged(e: { index: number, item }) {
            this.date = this.date.hour(e.index);
            this.$forceUpdate();
        }

        minuteChanged(e: { index: number, item }) {
            this.date = this.date.minute(e.index);
            this.$forceUpdate();
        }

        secondChanged(e: { index: number, item }) {
            this.date = this.date.second(e.index);
            this.$forceUpdate();
        }

        ampmChanged(e: { index: number, item }) {
            this.date = this.date.hour(e.index == 0 ? this.date.hour % 12 : 12 + this.date.hour % 12);
            this.$forceUpdate();
        }

        makeYears() {
            let start, end;
            if (/YY/.test(this.format)) {
                this.yearCaption = "";

                if (glob.config.locale == "fa") {
                    start = 1300;
                    end = 1450;
                } else {
                    start = 1900;
                    end = 2050;
                }
            } else {
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
                this.monthCaption = Constants.Jalali_Months[this.date.month()];
                this.months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
            } else {
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
                this.dayCaption = Constants.Jalali_Week_Days[this.date.day()];
            } else {
                this.days = null;
            }
        }

        makeHours() {
            if (/H/.test(this.format)) {
                this.hours = [];
                for (let i = 0; i < 24; i++) {
                    this.hours.push(this.addZero(i.toString()));
                }
            } else if (/h/.test(this.format)) {
                this.hours = [];
                for (let i = 0; i < 12; i++) {
                    this.hours.push(this.addZero(i.toString()));
                }
                this.amPm = ["AM", "PM"];
            } else {
                this.hours = null;
            }
        }

        makeMinutes() {
            if (/m/.test(this.format)) {
                this.minutes = [];
                for (let i = 0; i < 60; i++) {
                    this.minutes.push(this.addZero(i.toString()));
                }
            } else {
                this.minutes = null;
            }
        }

        makeSeconds() {
            if (/s/i.test(this.format)) {
                this.seconds = [];
                for (let i = 0; i < 60; i++) {
                    this.seconds.push(this.addZero(i.toString()));
                }
            } else {
                this.seconds = null;
            }
        }

        addZero(num) {
            return num < 10 ? '0' + num : num;
        }

        created() {
            this.format = glob.cmenu.jalaliDatePicker.format;
            this.value = glob.cmenu.jalaliDatePicker.value;

            this.date = this.value ? Jalali(this.value, this.format) : Jalali({hour: 0});
            this.date.locale("fa");

            if (!/s/i.test(this.format))
                this.date.set({second: 0, millisecond: 0});
            if (!/m/.test(this.format))
                this.date.set({minute: 0});
            if (!/H/.test(this.format))
                this.date.set({hour: 0});
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

        @Emit('changed')
        changed() {
            return {value: this.date.toDate()};
        }

        @Emit('canceled')
        cancel() {
            return {};
        }
    }
</script>

<style scoped lang="scss">
</style>
