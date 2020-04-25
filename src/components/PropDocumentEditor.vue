<template>
     <textarea :value="value" wrap="off" @blur="blur" autocorrect="off" spellcheck="false" autocapitalize="off"
               @keydown="keydown" :class="{'prop-document-editor col-md-8 border': true, 'border-danger': hasError}">
     </textarea>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, IData} from "../../../sys/src/types";
    import {glob} from '@/main';
    import {ItemChangeEventArg} from '@/types';

    @Component({name: 'PropDocumentEditor'})
    export default class PropDocumentEditor extends Vue {
        @Prop() private doc: IData;
        @Prop() private prop: Property;
        @Prop() private styles: string;

        $el: any;
        hasError = false;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }


        blur(e) {
            try {
                let val = (e.target as any).value ? JSON.parse(e.target.value) : null;
                this.hasError = false;
                this.update(val);
            } catch (ex) {
                this.doc._.msg = `Property '${this.prop.title}' invalid data.`;
                this.hasError = true;
                glob.dirty = true;
            }
        }

        @Emit('changed')
        update(val): ItemChangeEventArg {
            return {prop: this.prop, val, vue: this} as ItemChangeEventArg;
        }

        get value() {
            if (this.hasError) {
                return this.$el.value;
            } else {
                let val = this.doc[this.prop.name];
                return val ? JSON.stringify(val) : "";
            }
        }
    }
</script>

<style lang="scss">
    .prop-document-editor {
        min-height: 200px;
    }
</style>
