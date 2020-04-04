<template>
    <input @focus="focus" :type="type" :value="value" :placeholder="placeholder" tabindex="1"
           :name="viewType!=1 ? prop.name : null" @input="update" @keydown="keydown" :readonly="readonly">
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '@/types';
    import {getQs} from "@/main";
    import * as main from '@/main';

    @Component
    export default class PropText extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private viewType: string;
        @Prop() private prop: Property;

        @Emit("keydown")
        keydown(e): PropEventArg {
            if (e.which === Keys.up || e.which === Keys.down) e.preventDefault();
            return {prop: this.prop, event: e};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }

        @Emit("changed")
        update(e): ItemChangeEventArg {
            let text = this.type == "number" ? (e.target as any).valueAsNumber : (e.target as any).value;
            if (text === "") text = null;
            let locale = getQs('e') || 'en';
            let val = this.doc[this.prop.name];

            if (this.prop.text && this.prop.text.multiLanguage) {
                if (locale) {
                    if (typeof val == 'string')
                        val = {'en': val};
                    else
                        val = val || {};

                    val[locale] = text;
                } else {
                    if (val && typeof val == 'object')
                        val['en'] = text;
                    else
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
            return main.getPropTextValue(this.prop, this.doc);
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
