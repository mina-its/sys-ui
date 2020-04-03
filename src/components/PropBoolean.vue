<template>
    <CheckBox :checked="checked" @changed="change"></CheckBox>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {PropChangedEventArg} from "@/types";

    @Component
    export default class PropBoolean extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: any;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }

        @Emit('changed')
        change(e): PropChangedEventArg {
            return {prop: this.prop, val: e.val, vue: this};
        }

        get checked(): boolean {
            return !!this.doc[this.prop.name];
        }
    }
</script>

<style lang="scss">

</style>
