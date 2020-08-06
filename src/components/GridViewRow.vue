<template>
    <tr :class="{'highlight': meta.marked}" @click="click">
        <th scope="row" v-if="selectable" class="text-center">
            <CheckBox :checked="meta.marked"/>
        </th>
        <th v-else @click="headerClick" class="text-center"></th>
        <td @click="clickCell" v-for="(pMeta, index) in dec.properties">
            <Property @focus="focused" :item="item" :prop="pMeta" @changed="changed" @keydown="keydown"
                      :viewType="1" :indexInGrid="index" :readonly="readonly"/>
        </td>
    </tr>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {EntityMeta, IData} from "../../../sys/src/types";
    import {PropEventArg, ItemChangeEventArg, ItemEventArg} from '../types';

    declare let $: any;
    @Component({name: 'GridViewRow', components: {}})
    export default class GridViewRow extends Vue {
        @Prop() private item: IData;
        @Prop() private dec: any;
        @Prop() private selectable: boolean;
        @Prop() private readonly: boolean;

        focused(e: PropEventArg) {
            $("td.active").removeClass("active");
            $(e.event.target).closest("td").addClass("active");
        }

        clickCell(e){
            $("td.active").removeClass("active");
            $(e.target).closest("td").addClass("active");
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
            if (!this.item._) {
                console.error(`GridViewRow _ property is expected as meta!`);
                return {} as any;
            }
            return this.item._;
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

            td.active {
                outline: 1px solid var(--dark);
            }
        }
    }
</style>
