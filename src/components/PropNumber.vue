<template>
    <input @focus="focus" @blur="blur" :type="inputType" :value="value" :placeholder="placeholder"
           :name="viewType!=1 ? prop.name : null" @change="update" @keydown="keydown" :readonly="readOnly">
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {Keys, Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '@/types';
    import {digitGroup} from '@/main';
    import * as main from '../main';

    @Component({name: 'PropText'})
    export default class PropText extends Vue {
        @Prop() private doc: any;
        @Prop() private viewType: string;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;
        private focused: boolean = false;

        get inputType() {
            if (this.prop.number && this.prop.number.digitGrouping)
                return "text";
            else
                return "number";
        }

        @Emit("keydown")
        keydown(e): PropEventArg {
            if (e.which === Keys.up || e.which === Keys.down) e.preventDefault();
            return {prop: this.prop, event: e};
        }

        blur() {
            this.focused = false;
        }

        @Emit('focus')
        focus(e): PropEventArg {
            this.focused = true;
            return {prop: this.prop, event: e};
        }

        @Emit("changed")
        update(e): ItemChangeEventArg {
            let text = (e.target as any).value;
            if (text === "") text = null;
            let val = text != null ? text.indexOf('.') > -1 ? parseFloat(text) : parseInt(text) : null;
            return {prop: this.prop, val, vue: this};
        }

        get readonly() {
            return !!this.prop.formula;
        }

        get value() {
            let val = main.getPropTextValue(this.prop, this.doc);

            if (this.prop.number && this.prop.number.digitGrouping && !this.focused)
                return digitGroup(val);

            return val;
        }

        get placeholder() {
            if (!this.doc || this.prop.formula)
                return null;

            let val = this.doc[this.prop.name];
            if (val && typeof val === "object") {
                let locale = main.getQs('e') || "en";
                if (!val[locale])
                    return val["en"] || val[Object.keys(val)[0]];
            }
            return null;
        }

    }
</script>

<style lang="scss">

</style>
