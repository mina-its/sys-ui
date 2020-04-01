<template>
    <tr :class="{selected: meta.marked}" @click="click">
        <td v-if="selectable" class="text-center"><input type="checkbox" v-model="status" @change="updateStatus()"></td>
        <td v-else @click="headerClick" class="text-center"></td>
        <td v-for="(pMeta, index) in dec.properties">
            <Prop @focus="focused($event)" :item="item" :prop="pMeta" @changed="changed" @keydown="keydown"
                  :viewType="1" :indexInGrid="index"></Prop>
        </td>
    </tr>
</template>

<script lang="ts">
    declare let $: any;
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {ObjectDec, Property, EntityMeta} from "../../../sys/src/types";
    import {ItemPropChangedEventArg} from '@/types';

    const main = require('../main');

    @Component
    export default class GridViewRow extends Vue {
        @Prop() private item: any;
        @Prop() private selectable: boolean;
        @Prop() private dec: ObjectDec;

        focused(e, prop: Property) {
            $(".prop-focused").removeClass("prop-focused");
            $(e.target).closest("td").addClass("prop-focused");
        }

        @Emit('changed')
        changed(e: ItemPropChangedEventArg): ItemPropChangedEventArg {
            return e;
        }

        updateStatus() {
            this.meta.marked = (event.target as any).checked;
        }

        @Emit('headerClick')
        headerClick(e) {
            return {item: this.item, e};
        }

        @Emit('selected')
        click() {
            return this.item;
        }

        @Emit('keydown')
        keydown(e, prop) {
            return {e, item: this.item, prop};
        }

        get meta(): EntityMeta {
            return main.getMeta(this.item);
        }
    }
</script>

<style scoped lang="scss">

</style>
