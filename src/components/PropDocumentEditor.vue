<template>
<textarea :value="value" wrap="off" @blur="blur" autocorrect="off" spellcheck="false" autocapitalize="off"
          @keydown="keydown"
          :class="'prop-document-editor col-md-8 border '+styles+(invalidData ? ' border-danger': '')">
     </textarea>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property, WebMethod} from "../../../sys/src/types";
    import {glob} from '../main';;
    import {Modify, ItemChangeEventArg, ChangeType} from '../types';
    import * as main from '../main';

    @Component
    export default class PropDocumentEditor extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private styles: string;
        @Prop() private invalidData: any;

        $el: any;

        @Emit('keydown')
        keydown(e) {
            return {e};
        }

        blur(e) {
            try {
                let val = (e.target as any).value ? JSON.parse(e.target.value) : null;
                this.invalidData = false;

                // let ref = this.prop._.ref.replace(new RegExp(`/${this.prop.name}$`), "");
                // let data = {};
                // data[this.prop.name] = val;
                // glob.modifies.push({type: ChangeType.EditProp, data, ref} as Modify);
                // glob.modifies[ref][this.prop.name] = JSON.parse(JSON.stringify(val));

                this.update(val);
            } catch (ex) {
                //this.doc._error = `Property '${this.prop.title}' invalid data.`;
                this.invalidData = true;
                glob.dirty = true;
            }
        }

        @Emit('changed')
        update(val): ItemChangeEventArg {
            return {prop: this.prop, val} as ItemChangeEventArg;
        }

        get value() {
            if (this.invalidData) {
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
