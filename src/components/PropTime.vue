<template>
    <div class="prop-time">
        <div class="d-flex">
            <input @focus="$emit('focus', $event)" type="text" :value="value"
                   :name="viewType!=1 ? prop.name : null"
                   @blur="update" class="flex-grow-1 border-0 mx-2">
            <div class="dropdown">
                <i :class="{'fa':true, 'fa-clock-o': !datePick, 'fa-calendar': datePick}" @click="click"></i>
                <div v-if="showPicker" class="dropdown-menu dropdown-menu-right p-0 mt-1 show">
                    <DateTimePicker :format="format" :value="value" @changed="changed"
                                    @canceled="canceled"></DateTimePicker>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ItemChangeEventArg, ItemEventArg, Moment} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType, Keys, TimeFormat} from "../../../sys/src/types";
    import * as main from '../main';

    declare let $, moment: Moment;
    @Component({name: 'PropTime', components: {}})
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;

        private showPicker = false;

        update(e) {
            let val = e.target.value ? moment(e.target.value, this.format) : null;
            let date = val && val.isValid() ? val.toDate() : null;
            if (!date && e.target.value) {
                main.notify('invalid-date' + ": " + e.target.value, LogType.Error);
                this.$forceUpdate();
            } else
                this.changed({value: date});
        }

        @Emit('changed')
        changed(val): ItemChangeEventArg {
            this.showPicker = false;
            return {prop: this.prop, val: val.value, vue: this};
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
                if (this.prop.time.customFormat) return this.prop.time.customFormat;
                else if (this.prop.time.format) {
                    switch (this.prop.time.format) {
                        case TimeFormat.YearMonthDayHourMinute:
                            return "YYYY/MM/DD - HH:mm";

                        case TimeFormat.DateWithDayOfWeek:
                            return "YYYY/MM/DD";

                        case TimeFormat.HourMinute:
                            return "HH:mm";
                    }
                }
            }
            return "YYYY/MM/DD";
        }

        get value() {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format(this.format) : "";
        }
    }
</script>

<style scoped lang="scss">

</style>
