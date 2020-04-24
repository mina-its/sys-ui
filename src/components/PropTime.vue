<template>
    <div class="prop-time">
        <div class="d-flex">
            <div class="dropdown">
                <button class="icon dropdown-toggle" id="dropdownProfileBrief" data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                    <i class="fa fa-calendar"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right text-center profile-brief"
                     aria-labelledby="dropdownProfileBrief">
                    <DateTimePicker></DateTimePicker>
                </div>
            </div>

            <input @focus="$emit('focus', $event)" type="text" :value="value"
                   :name="viewType!=1 ? prop.name : null"
                   @blur="update" class="border-0 prop-time-date mx-2">
        </div>
    </div>
</template>

<script lang="ts">
    import {ItemChangeEventArg, ItemEventArg, Moment} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType, Keys} from "../../../sys/src/types";
    import * as main from '../main';
    import DateTimePicker from "@/components/DateTimePicker.vue";
    import DatePicker from "@/components/DatePicker.vue";

    declare let $, moment: Moment;
    @Component({
        components: {DatePicker, DateTimePicker}
    })
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;

        update(e) {
            let val = e.target.value ? moment.utc(e.target.value) : null;
            let date = val && val.isValid() ? val.toDate() : null;
            if (!date && e.target.value) {
                main.notify('invalid-date' + ": " + e.target.value, LogType.Error);
                this.$forceUpdate();
            } else
                this.change(date);
        }

        @Emit('changed')
        change(val): ItemChangeEventArg {
            return {prop: this.prop, val, vue: this};
        }

        get value() {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format("YYYY/MM/DD HH:mm") : "";
        }
    }
</script>

<style scoped lang="scss">
    .prop-time-date, .prop-time-time {
        width: 100px;
    }

    .icon {
        background-color: transparent;
        border: none;
        outline: none;

        &::after {
            display: none;
        }
    }
</style>
