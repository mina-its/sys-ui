<template>
    <a :href="ref" @click="click" @keydown="keydown">{{value}}</a>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import * as main from '../main';
    import {glob, prepareServerUrl, pushToGridViewRecentList} from "../main";
    import {PropEventArg} from "../types";

    @Component({name: 'PropLink'})
    export default class PropLink extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }

        click() {
            pushToGridViewRecentList(this.path, this.ref, this.value);
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

        get path() {
            return this.prop._.ref.replace(new RegExp(`\/${this.prop.name}$`), "");
        }

        get ref() {
            if (!this.doc._id)
                return "/";
            let url = "/" + this.path + "/" + this.doc._id;
            return prepareServerUrl(url, true);
        }
    }
</script>

<style scoped lang="scss">

</style>
