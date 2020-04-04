<template>
    <a @focus="$emit('focus', $event)" :href="ref" @keydown="keydown">{{value}}</a>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import * as main from '@/main';

    @Component
    export default class PropLink extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }

        get value() {
            if (this.prop.formula)
                return main.evalExpression(this.doc, this.prop.formula);

            let val = this.doc[this.prop.name];
            if (val && typeof val == "object") {
                let locale = main.getQs('e') || "en";
                return val[locale];
            } else
                return val;
        }

        get ref() {
            if (!this.doc._id)
                return "/";
            return "/" + this.prop._.ref.replace(new RegExp(`\/${this.prop.name}$`), "") + "/" + main.getBsonId(this.doc);
        }
    }
</script>

<style scoped lang="scss">

</style>
