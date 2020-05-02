<template>
    <textarea @focus="focus" :value="value" @input="update" :readonly="readOnly"
              class="text-nowrap form-control"></textarea>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '../types';
    import {glob} from "@/main";
    import * as main from '../main';

    @Component({name: 'PropTextMultiline'})
    export default class PropTextMultiline extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;

        @Emit('changed')
        update(e): ItemChangeEventArg {
            let text = e.target.value;
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

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }

        get value() {
            return main.getPropTextValue(this.prop, this.doc);
        }
    }
</script>

<style lang="scss">
    .prop-value.prop-text-multiline {
        width: var(--wide-props-width);
        min-height: var(--text-multiline-height);
        resize: both;
    }

    @media (max-width: 576px) {
        .prop-value.prop-text-multiline {
            width: 100%;
        }
    }
</style>
