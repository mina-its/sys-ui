<template>
    <div class="prop-time">
        <div class="d-flex">
            <input @focus="$emit('focus', $event)" type="text" :value="value"
                   :name="viewType!=1 ? prop.name : null"
                   @blur="update" class="flex-grow-1 border-0 mx-2">
            <div class="dropdown">
                <i class="fa fa-calendar" @click="click"></i>
                <div v-if="showPicker" class="dropdown-menu dropdown-menu-right p-0 mt-1 show">
                    <DateTimePicker :value="value" @changed="changed" @canceled="canceled"></DateTimePicker>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ItemChangeEventArg, ItemEventArg, Moment} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType, Keys} from "../../../sys/src/types";
    import * as main from '../main';
    import DateTimePicker from "@/components/DateTimePicker.vue";

    declare let $, moment: Moment;
    @Component({
        components: {DateTimePicker}
    })
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;

        private showPicker = false;

        update(e) {
            let val = e.target.value ? moment.utc(e.target.value) : null;
            let date = val && val.isValid() ? val.toDate() : null;
            if (!date && e.target.value) {
                main.notify('invalid-date' + ": " + e.target.value, LogType.Error);
                this.$forceUpdate();
            } else
                this.changed({date});
        }

        @Emit('changed')
        changed(val): ItemChangeEventArg {
            this.showPicker = false;
            return {prop: this.prop, val: val.date, vue: this};
        }

        canceled() {
            this.showPicker = false;
        }

        click() {
            this.showPicker = true;
        }

        get value() {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format("YYYY/MM/DD HH:mm") : "";
        }
    }
</script>

<style scoped lang="scss">

</style>
