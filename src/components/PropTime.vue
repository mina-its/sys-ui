<template>
    <input @focus="$emit('focus', $event)" type="text" :value="value" :name="viewType !== 1 ? prop.name : null"
           @blur="update" class="form-control">
</template>

<script lang="ts">
    import {PropChangedEventArg} from "@/types";

    declare let moment: any;
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, LogType} from "../../../sys/src/types";

    const main = require("@/main");

    @Component
    export default class PropTime extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private viewType: string;

        @Emit('changed')
        update(): PropChangedEventArg {
            let val = new Date((event.target as any).value);
            if (val.getTime()) {
                this.doc[this.prop.name] = val;
            } else {
                main.notify('invalid-date', LogType.Error);
                this.doc[this.prop.name] = null;
            }
            return {prop: this.prop, val: this.value};
        }

        get value() {
            let val = this.doc[this.prop.name];
            return val ? moment(val).format("YYYY/MM/DD") : "";
        }
    }
</script>

<style scoped lang="scss">

</style>
