<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" v-bind:type="type" @keydown="keydown"
           :value="value" tabindex="-1"
           @blur="refreshText" @input="update()" @click="update" class="form-control">
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/src/types";
    import {glob} from "@/main";
    import {Constants, MenuItem, PropChangedEventArg} from '@/types';

    const main = require("@/main");

    @Component
    export default class PropReference extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('keydown')
        keydown(e) {
            if (glob.cmenu.show && (e.which === Keys.up || e.which === Keys.down)) {
                e.preventDefault();
            }

            if (!glob.cmenu.show)
                return {e};
        }

        update(e) {
            let val = (e.target as any).value;
            let items = !val || (this.prop._.items.length < Constants.contextMenuVisibleItems && val == this.value) ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
            items.forEach(item => (item as MenuItem).hover = val == item.title);
            this.showDropDown(items);
        }

        refreshText() {
            let val = this.doc[this.prop.name];
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = val;
        }

        showDropDown(items) {
            if (!this.prop.required && items && items.length)
                items = [{ref: null, title: "", hover: false}].concat(items);

            main.showCmenu(this.prop, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                if (!main.equalRef(this.doc[this.prop.name], item.ref)) {
                    this.selectItem(item.ref);
                }
            });
        }

        @Emit('changed')
        selectItem(val: any): PropChangedEventArg {
            return {prop: this.prop, val, vue: this};
        }

        get value() {
            return main.getPropReferenceValue(this.prop, this.doc);
        }
    }
</script>

<style lang="scss">
    $right: right;

    .prop-reference:hover {
        background: url("/images/updown.png") no-repeat $right 0 center;
    }
</style>
