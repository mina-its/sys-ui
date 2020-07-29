<template>
    <div class="prop-text-editor">
        <textarea @focus="focus" ref="area" class="d-none"></textarea>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '../types';

    declare let $, CodeMirror: any;

    @Component({name: 'PropTextEditor'})
    export default class PropTextEditor extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;

        private codeMirror: any = null;

        mounted() {
            if ($(this.$el).next('.CodeMirror').length !== 0) return; // to prevent duplicate editor

            this.codeMirror = CodeMirror.fromTextArea(this.$refs.area, {
                value: this.doc[this.prop.name],
                tabSize: 4,
                readOnly: this.readOnly,
                lineNumbers: true,
                mode: "javascript"
            });

            this.codeMirror.on("change", this.changed);
            this.codeMirror.on("focus", this.focus);
        }

        @Emit('changed')
        changed(): ItemChangeEventArg {
            let val = this.codeMirror.getValue();
            return {prop: this.prop, val, vue: this};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }
    }
</script>

<style lang="scss">
    .prop-text-editor {
        .CodeMirror {
            border: 1px solid #dee2e6;
        }
    }
</style>
