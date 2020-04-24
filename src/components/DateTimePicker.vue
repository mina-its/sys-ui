<template>
    <div class="date-time-picker">
        <div class="d-flex p-3">
            <RollPicker caption="Year" :index="yearIndex" :items="years"></RollPicker>
            <RollPicker caption="Month" :index="monthIndex" :items="months"></RollPicker>
            <RollPicker caption="Day" :index="dayIndex" :items="days"></RollPicker>
            <div class="p-2">&nbsp;</div>
            <RollPicker caption="Hour" :index="hourIndex" :items="hours"></RollPicker>
            <RollPicker caption="Minute" :index="minuteIndex" :items="minutes"></RollPicker>
            <RollPicker caption="Second" :index="secondIndex" :items="seconds"></RollPicker>
        </div>
        <div class="d-flex w-100">
            <button @click="set" class="flex-fill text-center p-2 border">Set</button>
            <button @click="today" class="flex-fill text-center p-2 border">Today</button>
            <button @click="cancel" class="flex-fill text-center p-2 border">Cancel</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Function from "@/components/Function.vue";
    import RollPicker from "@/components/RollPicker.vue";

    declare let $: any;

    @Component({components: {RollPicker, Function}})
    export default class DateTimePicker extends Vue {
        @Prop() private format: string;
        @Prop() private value: string;

        set(){
            $('.dropdown-menu').removeClass('show');
        }

        today(){
            $('.dropdown-menu').removeClass('show');
        }

        cancel(){
            $('.dropdown-menu').removeClass('show');
        }

        private years = [];
        private yearIndex = 0;
        private months = [];
        private monthIndex = 0;
        private days = [];
        private dayIndex = 0;
        private hours = [];
        private hourIndex = 0;
        private minutes = [];
        private minuteIndex = 0;
        private seconds = [];
        private secondIndex = 0;

        created() {
            this.years = [];
            this.yearIndex = 120;
            for (let i = 1900; i < 2050; i++) {
                this.years.push(i.toString());
            }

            this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            this.monthIndex = 0;

            this.resetDays();

            this.hours = [];
            this.hourIndex = 0;
            for (let i = 0; i < 24; i++) {
                this.hours.push(this.addZero(i.toString()));
            }

            this.minutes = [];
            this.minuteIndex = 0;
            for (let i = 0; i < 60; i++) {
                this.minutes.push(this.addZero(i.toString()));
            }

            this.seconds = [];
            this.secondIndex = 0;
            for (let i = 0; i < 60; i++) {
                this.seconds.push(this.addZero(i.toString()));
            }

        }

        resetDays() {
            this.days = [];
            this.dayIndex = 0;
            for (let i = 1; i < 31; i++) {
                this.days.push(i.toString());
            }
        }

        addZero(num) {
            return num < 10 ? '0' + num : num;
        }
    }
</script>

<style scoped lang="scss">
</style>
