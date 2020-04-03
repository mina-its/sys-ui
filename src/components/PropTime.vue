<template>
    <input @focus="$emit('focus', $event)" type="text" :value="value" :name="viewType !== 1 ? prop.name : null"
           @blur="update" class="form-control">
</template>

<script lang="ts">
    import {PropChangedEventArg} from "@/types";
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType} from "../../../sys/src/types";

    const moment = require('moment');
    const main = require("@/main");

    @Component
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;

        update(e) {
            let val = moment.utc(e.target.value);
            if (!val.isValid()) {
                main.notify('invalid-date' + ": " + e.target.value, LogType.Error);
                this.$forceUpdate();
            } else
                this.change(val.toDate());
        }

        @Emit('changed')
        change(val): PropChangedEventArg {
            return {prop: this.prop, val, vue: this};
        }

        get value() {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format("YYYY/MM/DD") : "";
        }
    }
</script>

<style scoped lang="scss">

</style>
