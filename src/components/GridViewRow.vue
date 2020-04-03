<template>
    <tr :class="{'highlight': meta.marked}" @click="click">
        <th scope="row" v-if="selectable" class="text-center">
            <CheckBox :checked="meta.marked"></CheckBox>
        </th>
        <th v-else @click="headerClick" class="text-center"></th>
        <td v-for="(pMeta, index) in dec.properties">
            <Prop @focus="focused($event)" :item="item" :prop="pMeta" @changed="changed" @keydown="keydown"
                  :viewType="1" :indexInGrid="index"></Prop>
        </td>
    </tr>
</template>

<script lang="ts">
    import CheckBox from "@/components/CheckBox.vue";

    declare let $: any;
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {ObjectDec, Property, EntityMeta} from "../../../sys/src/types";
    import {ItemChangeEventArg, ItemEventArg} from '@/types';

    const main = require('../main');
    @Component({
        components: {CheckBox}
    })
    export default class GridViewRow extends Vue {
        @Prop() private item: any;
        @Prop() private selectable: boolean;
        @Prop() private dec: ObjectDec;

        focused(e, prop: Property) {
            $(".prop-focused").removeClass("prop-focused");
            $(e.target).closest("td").addClass("prop-focused");
        }

        @Emit('changed')
        changed(e: ItemChangeEventArg): ItemChangeEventArg {
            return e;
        }

        updateStatus() {
            this.meta.marked = (event.target as any).checked;
        }

        @Emit('headerClick')
        headerClick(e): ItemEventArg {
            return {item: this.item, event: e};
        }

        @Emit('selected')
        click(e): ItemEventArg {
            return {item: this.item, event: e};
        }

        @Emit('keydown')
        keydown(e: ItemEventArg): ItemEventArg {
            return {event: e.event, item: this.item, prop: e.prop} as ItemEventArg;
        }

        get meta(): EntityMeta {
            return main.getMeta(this.item);
        }
    }
</script>

<style lang="scss">
    tbody {
        tr {
            td:nth-child(2) {
                white-space: nowrap;
            }

            &:hover td {
                background-color: var(--grid-row-hover);
            }

            &.highlight td {
                background-color: var(--grid-row-highlight);
            }

            &:hover th, &.highlight th {
                background-color: var(--grid-row-header-highlight);
            }
        }
    }
</style>
