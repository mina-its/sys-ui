<template>
    <input @focus="focus" @blur="blur" :type="inputType" :value="value" :placeholder="placeholder"
           :name="viewType!=1 ? prop.name : null" @input="update" @keydown="keydown" :readonly="readOnly">
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '@/types';
    import {digitGroup, glob} from '@/main';
    import * as main from '../main';

    @Component({name: 'PropText'})
    export default class PropText extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private viewType: string;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;
        private focused: boolean = false;

        @Emit("keydown")
        keydown(e): PropEventArg {
            if (e.which === Keys.up || e.which === Keys.down) e.preventDefault();
            return {prop: this.prop, event: e};
        }

        get inputType(): string {
            if (this.prop.number && this.prop.number.digitGrouping)
                return "text";
            return this.type;
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
            let text = this.inputType == "number" ? (e.target as any).valueAsNumber : (e.target as any).value;
            if (text === "") text = null;
            let val = this.doc[this.prop.name];

            if (this.prop.text && this.prop.text.multiLanguage) {
                if (val == null)
                    this.$set(this.doc, this.prop.name, {});

                if (glob.config.locale) {
                    if (typeof val == 'string') {
                        let oldValue = val;
                        val = {};
                        val[glob.config.defaultLocale] = oldValue;
                        val[glob.config.locale] = text;
                        this.$set(this.doc, this.prop.name, val);
                    } else
                        val = val || {};

                    this.$set(this.doc[this.prop.name], glob.config.locale, text);
                    val[glob.config.locale] = text;
                } else {
                    if (val && typeof val == 'object' && glob.config.defaultLocale) {
                        this.$set(this.doc[this.prop.name], glob.config.defaultLocale, text);
                        val[glob.config.defaultLocale] = text;
                    } else
                        val = text;
                }
            } else
                val = text;

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
