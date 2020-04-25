<template>
    <textarea @focus="focus" :value="value" @input="update"
              class="text-nowrap form-control"></textarea>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '../types';

    @Component({name: 'PropTextMultiline'})
    export default class PropTextMultiline extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('changed')
        update(e): ItemChangeEventArg {
            let val = e.target.value;
            if (val === "") val = null;
            return {prop: this.prop, val, vue: this};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }

        get value() {
            return this.doc[this.prop.name];
        }
    }
</script>

<style lang="scss">
    .prop-value.prop-text-multiline {
        width: var(--wide-props-width);
        min-height: var(--text-multiline-height);
        resize: both;
    }

    @media (max-width: 576px) {
        .prop-value.prop-text-multiline {
            width: 100%;
        }
    }
</style>
