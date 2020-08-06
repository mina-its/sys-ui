<template>
    <check-box @focus="focus" :label="label" :checked="checked" @changed="change"/>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '../types';

    @Component({name: 'PropBoolean'})
    export default class PropBoolean extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: any;
        @Prop() private label?: string;
        @Prop() private readOnly: boolean;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }

        @Emit('changed')
        change(e): ItemChangeEventArg {
            return {prop: this.prop, val: e.val, vue: this};
        }

        get checked(): boolean {
            if (this.readOnly) return;
            return !!this.doc[this.prop.name];
        }
    }
</script>
