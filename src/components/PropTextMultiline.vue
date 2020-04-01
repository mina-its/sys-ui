<template>
    <textarea @focus="$emit('focus', $event)" :value="value" @input="update()"
              class="text-nowrap form-control"></textarea>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {PropChangedEventArg} from "@/types";

    @Component
    export default class PropTextMultiline extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('changed')
        update(): PropChangedEventArg {
            let val = (event.target as any).value;
            if (val === "") val = null;
            this.doc[this.prop.name] = val;
            return {prop: this.prop, val: this.value};
        }

        get value() {
            return this.doc[this.prop.name];
        }
    }
</script>

<style lang="scss">
    .prop-text-multiline {
        width: 500px;
        min-height: 150px;
        resize: both;
    }

    @media (max-width: 576px) {
        .prop-text-multiline {
            width: 100%;
        }
    }
</style>
