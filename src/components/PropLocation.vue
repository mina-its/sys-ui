<template>
    <div :class="{'prop-location prop-value fa-lg': true, 'has-data':value}" @click="changing">
        <i class="fa fa-map-marker text-dark"></i>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {glob} from '@/main';
    import {ItemChangeEventArg} from '@/types';

    @Component({name: 'PropLocation'})
    export default class PropLocation extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: any;
        @Prop() private readOnly: boolean;

        @Emit('changed')
        changed(val): ItemChangeEventArg {
            return {prop: this.prop, val, vue: this};
        }

        changing() {
            if (this.readOnly) return;
            let doc = this.doc;
            let changed = this.changed;
            glob.geoMap = {
                show: true,
                val: this.value,
                select: changed
            };
        }

        get value() {
            return this.doc[this.prop.name];
        }
    }
</script>

<style lang="scss">
    .prop-location {
        cursor: pointer;

        &:not(.has-data) {
            opacity: .2;
        }
    }
</style>
