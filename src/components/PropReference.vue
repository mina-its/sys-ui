<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" v-bind:type="type" @keydown="keydown" :value="value"
           @blur="refreshText" @input="update()" @click="update" class="form-control">
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/src/types";
    import {glob} from "@/main";
    import {MenuItem, PropChangedEventArg} from '@/types';

    const main = require("@/main");

    @Component
    export default class PropReference extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('keydown')
        keydown(e) {
            if (e.which === Keys.up || e.which === Keys.down)
                e.preventDefault();

            if (!glob.cmenu.show)
                return {e};
        }

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

        showDropDown(items) {
            if (!this.prop.required && items && items.length)
                items = [{uri: null, title: "", hover: false}].concat(items);

            main.showCmenu(this.prop, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => this.selectItem(item));
        }

        @Emit('changed')
        selectItem(item: MenuItem): PropChangedEventArg {
            if (item == null) { // Esc
                this.refreshText();
                return;
            }
            this.doc[this.prop.name] = null;
            this.doc[this.prop.name] = item.ref;
            return {prop: this.prop, val: this.value};
        }

        get value() {
            return main.getPropReferenceValue(this.prop, this.doc);
        }
    }
</script>

<style scoped lang="scss">

</style>
