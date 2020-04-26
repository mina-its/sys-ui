<template>
    <div class="card card-view">
        <div class="card-body">
            <Prop v-for="prop in dec.properties" :key="prop.name" :item="item" :prop="prop"
                  @changed="changed" :viewType="2"></Prop>
        </div>
    </div>
</template>

<script lang="ts">
    import {ItemChangeEventArg, StateChange, ChangeType, JQuery} from '@/types';
    import {Component, Prop as ComProp, Vue, Watch} from 'vue-property-decorator';
    import {ObjectDetailsViewType, ObjectDec, Context} from "../../../sys/src/types";
    import {glob} from '@/main';
    import * as main from '../main';
    import Prop from "@/components/Prop.vue";

    @Component({name: 'CardView', components: {Prop}})
    export default class CardView extends Vue {
        @ComProp() private uri: string;
        @ComProp() private root: boolean;
        @ComProp() private dec: ObjectDec;

        get item() {
            return this.$store.state.data[this.uri];
        }

        changed(e: ItemChangeEventArg) {
            main.dispatchStoreModify(this, {
                type: ChangeType.EditProp,
                prop: e.prop,
                value: e.val,
                item: e.item,
                uri: this.uri,
                vue: e.vue
            } as StateChange);
        }
    }
</script>

<style scoped lang="scss">

</style>
