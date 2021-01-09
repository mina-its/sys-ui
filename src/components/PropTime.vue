<template>
    <div class="prop-time">
        <div class="d-flex">
            <input ref="ctrl" @focus="focus" type="text" :value="value"
                   :placeholder="placeHolder" @keydown.esc="escape" @keydown.enter="update"
                   :name="viewType!=1 ? prop.name : null" :readonly="readOnly" @input="dirty=true"
                   @blur="update" :class="{'w-100 flex-grow-1 border-0':1,'prop-error':hasError}">
            <div class="dropdown" v-if="!readOnly">
                <i :class="{'fa text-muted':1,'ml-1':ltr,'mr-1':rtl,'fa-clock':!datePick, 'fa-calendar-alt': datePick}" @click="click"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {AppStateCmenu, ItemChangeEventArg, PropEventArg} from '../types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Locale, TimeFormat} from "../../../sys/src/types";
    import {$t, glob, notify} from "../main";
    import Jalali = require('jalali-moment');

    declare let $, moment: any;
    @Component({name: 'PropTime', components: {}})
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;
        @Prop() private readOnly: boolean;
        @Prop() private placeHolder: string;

        private dirty = false;
        private hasError = false;

        escape() {
            this.hasError = false;
            this.$forceUpdate();
        }

        update(e) {
            // Ignore if not change
            if (!this.dirty) return;

            let val = e.target.value ? moment(e.target.value, this.format) : null;
            let date: Date = val && val.isValid() ? val.toDate() : null;
            if (!date && e.target.value) {
                this.hasError = true;
            } else {
                this.hasError = false;
                this.changed({value: date});
            }
        }

        @Emit('focus')
        focus(e): PropEventArg {
            // this.focused = true;
            return {prop: this.prop, event: e};
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
                datePicker: glob.config.locale != Locale[Locale.fa] ? {
                    value: this.value,
                    format: this.format
                } : null,
                jalaliDatePicker: glob.config.locale == Locale[Locale.fa] ? {
                    value: this.value,
                    format: this.format
                } : null,
                state: this,
                event: {ctrl: this.$refs.ctrl},
                handler: (state, val) => {
                    state.changed(val);
                }
            } as AppStateCmenu;
        }

        get format() {
            if (this.prop.time) {
                if (this.prop.time.customFormat) return this.prop.time.customFormat;
                else if (this.prop.time.format) {
                    if (glob.config.locale == "fa") {
                        switch (this.prop.time.format) {
                            case TimeFormat.YearMonthDayHourMinute:
                                return "jYYYY/jMM/jDD - HH:mm";

                            case TimeFormat.DateWithDayOfWeek:
                                return "jYYYY/jMM/jDD";

                            case TimeFormat.HourMinute:
                                return "HH:mm";

                            case TimeFormat.YearMonthDay:
                                return "jYYYY/jMM/jDD";

                            case TimeFormat.DayMonthNameYear:
                                return "jDD jMMM jYYYY";
                        }
                    } else {
                        switch (this.prop.time.format) {
                            case TimeFormat.YearMonthDayHourMinute:
                                return "YYYY/MM/DD - HH:mm";

                            case TimeFormat.DateWithDayOfWeek:
                                return "YYYY/MM/DD";

                            case TimeFormat.HourMinute:
                                return "HH:mm";

                            case TimeFormat.YearMonthDay:
                                return "YYYY/MM/DD";

                            case TimeFormat.DayMonthNameYear:
                                return "DD MMM YYYY";
                        }
                    }
                }
            }

            if (glob.config.locale == Locale[Locale.fa])
                return "jYYYY/jMM/jDD";
            else
                return "YYYY/MM/DD";
        }

        get value(): string {
            if (this.hasError) return $(this.$refs.ctrl).val();
            let val = this.doc[this.prop.name];

            const mom = glob.config.locale == Locale[Locale.fa] ? Jalali(val) : moment(val);
            return val ? mom.format(this.format) : "";
        }
    }
</script>

<style lang="scss">
    .prop-time input {
        min-width: 6rem;
    }
</style>
