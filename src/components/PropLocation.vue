<template>
    <div :class="'prop-location text-center ' + (value ? 'has-data': '')" @click="changing">
        <i class="fa fa-map-marker-alt"></i>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {glob} from '../main';;
    import {ItemChangeEventArg} from '../types';;
    import * as main from '../main';

    @Component
    export default class PropLocation extends Vue {
        @Prop() private prop: Property;
        @Prop() private doc: any;

        @Emit('changed')
        changed(val): ItemChangeEventArg {
            return {prop: this.prop, val, vue: this};
        }

        changing() {
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
    .prop-location:not(.has-data) {
        opacity: .2;
    }
</style>
