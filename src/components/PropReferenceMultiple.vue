<template>
    <div @focus="focus" tabindex="1" ref="ctrl" :class="styles + ' prop-reference ref-multi'">
        <div v-for="item in items" class="rounded-lg rmI d-inline-block mr-1 my-1 px-1 border text-nowrap">
            <i @click="remove(item)" class="text-black-50 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV">{{item.title}}</span>
        </div>
        <textarea @click="showDropDown(prop._.items)" style="width:50px;outline: none;resize:none;overflow:hidden;"
                  @blur="refreshText" @input="update()" class="bg-transparent align-middle rmT d-inline border-0"
                  rows="1" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"
                  tabindex="1"></textarea>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Pair} from "../../../sys/src/types";
    import {MenuItem, PropChangedEventArg} from '@/types';

    const $ = require('jquery');
    const main = require("@/main");

    @Component
    export default class PropReferenceMultiple extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;

        update() {
            let val = (event.target as any).value;
            let items = val == "" ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            items.forEach(item => (item as MenuItem).hover = false);
            this.showDropDown(items);
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
        remove(item) {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = val.filter(v => JSON.stringify(v) != JSON.stringify(item.ref));
            return {prop: this.prop, val};
        }

        showDropDown(items) {
            let valueStrKeys = this.value.map(v => JSON.stringify(v));
            items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
            main.showCmenu(this.prop, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => this.selectItem(item));
        }

        @Emit('changed')
        selectItem(item: MenuItem): PropChangedEventArg {
            if (item == null) { // Esc
                this.refreshText();
                return;
            }
            let val = this.doc[this.prop.name];
            if (!val) this.doc[this.prop.name] = val = [];
            val.push(item.ref);
            return {prop: this.prop, val: this.value};
        }

        get value() {
            let val = this.doc[this.prop.name];
            if (!val) this.doc[this.prop.name] = val = [];
            else if (!Array.isArray(val))
                val = [val];
            return val;
        }

        get items() {
            let items: Pair[] = [];
            for (const v of this.value) {
                let item = this.prop._.items.find(i => main.equalRef(v, i.ref));
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
    }

    .prop-reference.ref-multi textarea {
        display: none !important;
    }

    .prop-reference.ref-multi:focus textarea, .prop-reference.ref-multi:focus-within textarea {
        display: inline-block !important;
    }
</style>
