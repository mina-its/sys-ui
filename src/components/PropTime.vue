<template>
    <input @focus="$emit('focus', $event)" type="text" :value="value" :name="viewType!=1 ? prop.name : null"
           @blur="update" class="form-control">
</template>

<script lang="ts">
    import {ItemChangeEventArg, Moment} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType} from "../../../sys/src/types";
    import * as main from '../main';

    declare let moment: Moment;

    @Component
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
            return val ? moment(val).format("YYYY/MM/DD") : "";
        }
    }
</script>

<style lang="scss">
    .prop-time:hover {
        background: url('/images/calendar.png') no-repeat var(--right) 5px center;
    }
</style>
