<template>
    <div class="prop-time">
        <div class="d-flex">
            <input ref="ctrl" @focus="$emit('focus', $event)" type="text" :value="value"
                   :name="viewType!=1 ? prop.name : null" :readonly="readOnly" @input="dirty=true"
                   @blur="update" class="flex-grow-1 border-0">
            <div class="dropdown" v-if="!readOnly">
                <i :class="{'fa text-muted':true, 'ml-1': ltr, 'mr-1':rtl, 'fa-clock': !datePick, 'fa-calendar-alt': datePick}" @click="click"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {AppStateCmenu, ItemChangeEventArg, ItemEventArg, MenuItem, Moment} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType, Keys, TimeFormat} from "../../../sys/src/types";
    import * as main from '../main';
    import {glob} from "../main";

    declare let $, moment: Moment;
    @Component({name: 'PropTime', components: {}})
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;
        @Prop() private readOnly: boolean;

        private dirty = false;

        update(e) {
            // Ignore if not change
            if (!this.dirty) return;

            let val = e.target.value ? moment(e.target.value, this.format) : null;
            let date: Date = val && val.isValid() ? val.toDate() : null;
            if (!date && e.target.value) {
                main.notify('invalid-date' + ": " + e.target.value, LogType.Error);
                this.$forceUpdate();
            } else
                this.changed({value: date});
        }

        @Emit('changed')
        changed(val: { value: Date }): ItemChangeEventArg {
            return {prop: this.prop, val: val.value, vue: this};
        }

        get datePick() {
            return /D/.test(this.format) || /Y/.test(this.format);
        }

        click(e) {
            glob.cmenu = {
                show: true,
                datePicker: {
                    value: this.value,
                    format: this.format
                },
                state: this,
                event: {ctrl: this.$refs.ctrl},
                handler: (state, val) => state.changed(val)
            } as AppStateCmenu;
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

        get value(): string {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format(this.format) : "";
        }
    }
</script>

<style lang="scss">
</style>
