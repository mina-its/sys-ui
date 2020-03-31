<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" :type="type" :value="value" :placeholder="placeholder"
           :name="viewType !== 1 ? prop.name : null" @input="update()" @keydown="keydown" :readonly="readonly">
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Property, Keys} from "../../../sys/types";

    const main = require("@/main");

    @Component
    export default class PropText extends Vue {
        @Prop() private type: string;
        @Prop() private doc: any;
        @Prop() private viewType: string;
        @Prop() private prop: Property;

        keydown(e) {
            if (e.which === Keys.up || e.which === Keys.down) {
                e.preventDefault();
            }
            this.$emit('keydown', e);
        }

        update() {
            let val = this.type == "number" ? (event.target as any).valueAsNumber : (event.target as any).value;
            if (val === "") val = null;
            main.setPropTextValue(this.prop, this.doc, val);
            this.$emit("changed", this.prop, this.value);
        }

        get readonly() {
            return this.prop.formula;
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

<style scoped lang="scss">

</style>
