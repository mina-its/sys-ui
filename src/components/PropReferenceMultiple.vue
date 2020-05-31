<template>
    <div @focus="focus" tabindex="1" ref="ctrl" :class="styles + ' prop-reference ref-multi pr-3'">
        <div v-for="item in items"
             :class="{'ref-multi-item rounded-lg rmI d-inline-block my-1 px-1 border text-nowrap':1,'mr-1':ltr,'ml-1':rtl}">
            <i @click="remove(item)" class="text-black-50 mx-1 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV cursor-pointer">{{item.title}}</span>
        </div>
        <textarea @click="click" @blur="refreshText" @input="update" v-if="!readOnly"
                  class="w-100 bg-transparent align-middle rmT d-inline border-0"
                  rows="1" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"
                  tabindex="1"></textarea>
        <div v-else class="pt-2 pb-3">&nbsp;</div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Pair} from "../../../sys/src/types";
    import {MenuItem, ItemChangeEventArg, JQuery} from '@/types';
    import {showPropRefMenu} from "@/main";

    declare let $: JQuery;
    import * as main from '../main';

    @Component({name: 'PropReferenceMultiple'})
    export default class PropReferenceMultiple extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;
        @Prop() private readOnly: boolean;

        update(e, clicked) {
            if (this.readOnly) return;
            let val = (e.target as any).value;
            showPropRefMenu(this.prop, this.doc, clicked ? "" : val, this.$refs.ctrl, true, (item: MenuItem) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                this.selectItem(item);
            });
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
            $(this.$refs.ctrl).find("textarea").focus();
        }

        @Emit('changed')
        remove(item: Pair) {
            let val = this.doc[this.prop.name];
            val = val.filter(v => !main.equalID(v, item.ref));
            return {prop: this.prop, val, vue: this};
        }

        @Emit('changed')
        selectItem(item: MenuItem): ItemChangeEventArg {
            if (!item) { // Esc
                this.refreshText();
                return;
            }
            let val = this.doc[this.prop.name];
            if (!val) val = [];
            val = [...val];
            val.push(item.ref);
            return {prop: this.prop, val, vue: this};
        }

        get value() {
            let val = this.doc[this.prop.name];
            if (!val) this.doc[this.prop.name] = val = [];
            else if (!Array.isArray(val))
                val = [val];
            return val;
        }

        get items(): Pair[] {
            // console.log(this.value);
            let items: Pair[] = [];
            for (const v of this.value) {
                let item = this.prop._.items.find(i => main.equalID(v, i.ref));
                if (item)
                    items.push(item);
                else
                    items.push({title: "...", ref: v});
            }
            return items;
        }
    }
</script>

<style lang="scss">
    .prop-reference.ref-multi {
        outline: none;
        padding: 0 0.25rem !important;

        textarea {
            width: 40px !important;
            outline: none;
            resize: none;
            overflow: hidden;
        }

        .ref-multi-item {
            background-color: whitesmoke;
        }

        .rmV {
            font-size: smaller;
            color: #666;
        }
    }

    /*.prop-reference.ref-multi textarea {*/
    /*    display: none !important;*/
    /*}*/

    /*.prop-reference.ref-multi:focus textarea, .prop-reference.ref-multi:focus-within textarea {*/
    /*    display: inline-block !important;*/
    /*}*/
</style>
