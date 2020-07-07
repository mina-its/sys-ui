<template>
    <div @focus="focus" tabindex="1" ref="ctrl" :class="styles + ' prop-text-multi pr-3'">
        <div v-for="item in items"
             :class="{'ref-multi-item rounded-lg rmI d-inline-block my-1 px-1 border text-nowrap':1,'mr-1':ltr,'ml-1':rtl}">
            <i @click="remove(item)" class="text-black-50 mx-1 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV cursor-pointer">{{item}}</span>
        </div>
        <input @click="click" @blur="refreshText" @change="update" v-if="!readOnly"
               class="bg-transparent rmT border-0"
               spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"
        ></input>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Pair} from "../../../sys/src/types";
    import {MenuItem, ItemChangeEventArg, JQuery} from '@/types';
    import {showPropRefMenu} from "@/main";

    declare let $: JQuery;
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
            this.addtem(val);
        }

        click(e) {
            this.update(e, true);
        }

        refreshText() {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = val;
        }

        focus() {
            $(this.$refs.ctrl).find("input").focus();
        }

        @Emit('changed')
        remove(item: string) {
            let val = this.items.filter(v => v != item);
            return {prop: this.prop, val, vue: this};
        }

        @Emit('changed')
        addtem(value: string): ItemChangeEventArg {
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
        outline: none;
        padding: 0 0.25rem !important;

        .ref-multi-item {
            background-color: whitesmoke;
        }

        .rmV {
            font-size: smaller;
            color: #666;
        }
    }
</style>
