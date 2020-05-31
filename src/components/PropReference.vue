import {PropertyReferType} from "../../../sys/src/types";
<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" v-bind:type="type" @keydown="keydown" :readonly="readOnly"
           :value="value" @blur="refreshText" @input="update" @click="update" class="form-control">
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {Keys, Pair, Property, PropertyReferType} from "../../../sys/src/types";
    import * as main from '../main';
    import {parse, processThisExpression, stringify} from '../main';
    import {call, glob, notify} from '@/main';
    import {Constants, ID, ItemChangeEventArg, MenuItem, PropEventArg} from '../types';

    @Component({name: 'PropReference'})
    export default class PropReference extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;

        @Emit('keydown')
        keydown(e): PropEventArg {
            if (glob.cmenu.show && (e.which === Keys.up || e.which === Keys.down)) {
                e.preventDefault();
            }

            if (!glob.cmenu.show)
                return {prop: this.prop, event: e};
        }

        update(e) {
            if (this.readOnly) return;
            let val = (e.target as any).value;
            // console.log(val);

            if (this.prop._.isRef) {
                // console.log(this.prop);
                let query = this.prop.filter ? parse(processThisExpression(this.doc, this.prop.filter), true, ID) : null;
                let instance = this.doc;
                if (this.prop.referType == PropertyReferType.InnerSelectType) {
                    let match = this.prop._.ref.match(/^(\w+\/\w+)/);
                    instance = this.$store.state.data[match[1]];
                }
                let data = {prop: this.prop, instance, phrase: val, query};

                call('getPropertyReferenceValues', data, (err, res) => {
                    if (err) notify(err);
                    else {
                        for (let item of res.data as Pair[]) {
                            if (!this.prop._.items.find(i => i.ref == item.ref))
                                this.prop._.items.push(item);
                        }
                        this.showDropDown(res.data);
                    }
                });
            } else {
                let items = val == null || (this.prop._.items.length < Constants.contextMenuVisibleItems && val == this.value) ? this.prop._.items : this.prop._.items.filter(item => item.title && item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
                items.forEach(item => (item as MenuItem).hover = val == item.title);
                this.showDropDown(items);
            }
        }

        $refs: {
            ctrl: HTMLInputElement
        };

        refreshText() {
            this.$refs.ctrl.value = this.value;
        }

        showDropDown(items) {
            if (!this.prop.required && items && items.length)
                items = [{ref: null, title: "", hover: false}].concat(items);

            main.showCmenu(this.prop, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                if (!main.equalID(this.doc[this.prop.name], item.ref)) {
                    this.selectItem(item.ref);
                }
            });
        }

        @Emit('changed')
        selectItem(val: any): ItemChangeEventArg {
            return {prop: this.prop, val, vue: this};
        }

        get value() {
            return main.getPropReferenceValue(this.prop, this.doc);
        }
    }
</script>

<style lang="scss">
    $right: right;

    .prop-reference:not([readonly]):hover {
        background: url("/@sys-ui/images/updown.png") no-repeat $right 0 center;
    }
</style>
