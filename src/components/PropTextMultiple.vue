<template>
    <div @click="focus" :class="styles + ' prop-text-multi pb-0'">
        <div v-for="item in items"
             :class="{'ref-multi-item rounded-lg rmI d-inline-block mb-1 px-1 border text-nowrap':1,'mr-1':ltr,'ml-1':rtl}">
            <i @click="remove(item)" class="text-black-50 mx-1 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV cursor-pointer">{{item}}</span>
        </div>
        <input @blur="refreshText" @change="update" v-if="!readOnly"
               class="bg-transparent rmT border-0">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Pair} from "../../../sys/src/types";
    import {MenuItem, ItemChangeEventArg, JQuery} from '@/types';
    import {showPropRefMenu} from "@/main";

    declare let $: any;
    import * as main from '../main';

    @Component({name: 'PropTextMultiple'})
    export default class PropTextMultiple extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;
        @Prop() private readOnly: boolean;

        update(e, clicked) {
            if (this.readOnly) return;
            let val = (e.target as any).value;
            if (!val) return;
            e.target.value = "";
            this.addItem(val);
        }

        refreshText() {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = val;
        }

        focus() {
            $(this.$el).find("input").focus();
        }

        @Emit('changed')
        remove(item: string) {
            let val = this.items.filter(v => v != item);
            return {prop: this.prop, val, vue: this};
        }

        @Emit('changed')
        addItem(value: string): ItemChangeEventArg {
            if (!value) { // Esc
                this.refreshText();
                return;
            }
            let val = this.items;
            val.push(value);
            return {prop: this.prop, val, vue: this};
        }

        get items(): string[] {
            let val = this.doc[this.prop.name];
            if (!val) this.doc[this.prop.name] = val = [];
            else if (!Array.isArray(val))
                val = [val];
            return val;
        }
    }
</script>

<style lang="scss">
    .prop-text-multi {
        min-height: 2rem;

        &:focus-within {
            outline: 1px dotted #212121;
            outline: 5px auto -webkit-focus-ring-color;
        }

        input {
            width: 1rem !important;
            outline: none;

            &:focus {
                width: 8rem !important;
            }
        }

        .ref-multi-item {
            background-color: whitesmoke;
        }

        .rmV {
            font-size: smaller;
            color: #666;
        }
    }
</style>
