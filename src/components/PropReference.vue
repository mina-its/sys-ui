<template>
    <input @focus="focus" ref="ctrl" v-bind:type="type" @keydown="keydown" :readonly="readOnly"
           :value="value" @blur="refreshText" @input="update" @click="click" class="form-control">
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {Keys, Pair, Property, PropertyReferType, LogType} from "../../../sys/src/types";
    import * as main from '../main';
    import {parse, processThisExpression, showPropRefMenu} from '../main';
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

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }

        click(e) {
            this.update(e, true);
        }

        update(e, clicked) {
            if (this.readOnly) return;
            let val = (e.target as any).value;
            showPropRefMenu(this.prop, this.doc, clicked ? "" : val, this.$refs.ctrl, false, (item: MenuItem) => {
                if (item == null) { // Esc
                    this.refreshText();
                    return;
                }
                if (!main.equalID(this.doc[this.prop.name], item.ref)) {
                    this.selectItem(item.ref);
                }
            });
        }

        $refs: {
            ctrl: HTMLInputElement
        };

        refreshText() {
            this.$refs.ctrl.value = this.value;
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
        background: url("/images/updown.png") no-repeat $right 0 center;
    }
</style>
