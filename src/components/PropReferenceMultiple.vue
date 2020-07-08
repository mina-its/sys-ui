<template>
    <div @click="focus" :class="styles + ' prop-reference ref-multi pb-0 pl-1 pr-3'">
        <div v-for="item in items"
             :class="{'ref-multi-item rounded-lg rmI d-inline-block mb-1 px-1 border text-nowrap':1,'mr-1':ltr,'ml-1':rtl}">
            <i @click="remove(item)" class="text-black-50 mx-1 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV cursor-pointer">{{item.title}}</span>
        </div>
        <input @blur="refreshText" @input="update" v-if="!readOnly" @keydown="keypress"
               class="bg-transparent rmT border-0" @click="click" v-model="phrase"
               spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Pair, Keys} from "../../../sys/src/types";
    import {MenuItem, ItemChangeEventArg, JQuery} from '../types';
    import {showPropRefMenu} from "../main";

    declare let $: JQuery;
    import * as main from '../main';

    @Component({name: 'PropReferenceMultiple'})
    export default class PropReferenceMultiple extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;
        @Prop() private readOnly: boolean;
        private phrase: string = '';

        update(e, clicked) {
            if (this.readOnly) return;
            showPropRefMenu(this.prop, this.doc, clicked ? "" : this.phrase, this.$el, true, (item: MenuItem) => {
                this.phrase = "";
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                $(this.$el).find("input").focus();
                this.selectItem(item);
            });
        }

        keypress(e) {
            switch (e.which) {
                case Keys.backspace:
                    // this.items.pop();
                    break;
            }
        }

        click(e) {
            this.update(e, true);
        }

        refreshText() {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = val;
        }

        focus(e) {
            $(this.$el).find("input").focus();
            this.update(e, true);
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
            if (!Array.isArray(val)) val = [val];
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
        min-height: 2rem;

        &:focus-within {
            outline: 1px dotted #212121;
            outline: 5px auto -webkit-focus-ring-color;
        }

        input {
            width: 1px !important;
            outline: none;

            &:focus {
                width: 4rem !important;
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
