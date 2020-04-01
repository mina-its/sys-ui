<template>
    <input @focus="$emit('focus', $event)" type="checkbox" :id="prop.name" class="form-check-input" v-model="value"
           :name="prop.name" @keydown="keydown" @change="update">
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
        update(): PropChangedEventArg {
            this.doc[this.prop.name] = (event.target as any).checked;
            return {prop: this.prop, val: this.value};
        }

        get value() {
            return this.doc[this.prop.name];
        }
    }
</script>

<style scoped lang="scss">

</style>
