<template>
    <tr :class="item._status?'selected':''" @click="click">
        <td v-if="selectable" class="text-center"><input type="checkbox" v-model="status" @change="updateStatus()"></td>
        <td v-else @click="headerClick(item, $event)" class="text-center"></td>
        <td v-for="(pMeta, index) in dec.properties">
            <Prop @focus="focused($event)" :item="item" :prop="pMeta" @changed="changed" @keydown="keydown"
                  :viewType="1" :indexInGrid="index"></Prop>
        </td>
    </tr>
</template>

<script lang="ts">
    declare let $: any;
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {ObjectDec, Property, EntityMeta} from "../../../sys/types";
    import {RowStatus} from '@/types';

    @Component
    export default class GridViewRow extends Vue {
        @Prop() private item: any;
        @Prop() private selectable: boolean;
        @Prop() private dec: ObjectDec;

        focused(e, prop: Property) {
            $(".prop-focused").removeClass("prop-focused");
            $(e.target).closest("td").addClass("prop-focused");
        }

        @Emit()
        changed(prop: Property, val) {
            //this.$emit('changed', prop, val);
            return {prop, val};
        }

        updateStatus() {
            this.meta.marked = (event.target as any).checked;
        }

        headerClick(item, $event) {
            this.$emit('headerClick', item, $event);
        }

        click() {
            this.$emit('selected', this.item);
        }

        keydown(e, prop) {
            this.$emit('keydown', e, this.item, prop);
        }

        get meta(): EntityMeta {
            return this.item._ as EntityMeta;
        }
    }
</script>

<style scoped lang="scss">

</style>
