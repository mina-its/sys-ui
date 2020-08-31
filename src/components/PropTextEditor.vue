<template>
    <div class="prop-text-editor">
        <textarea @focus="focus" ref="area" class="d-none"></textarea>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit, Watch} from 'vue-property-decorator';
    import {Property, TextEditor} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '../types';
    import * as main from "../main";
    import {getPropTextValue} from "../main";

    declare let $, CodeMirror: any;

    @Component({name: 'PropTextEditor'})
    export default class PropTextEditor extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;

        @Watch('value')
        onValueChanged(value: string, oldValue: string) {
            if (value != this.codeMirror.getValue()) {
                this.codeMirror.setValue(value);
            }
        }

        private codeMirror: any = null;

        mounted() {
            if ($(this.$el).next('.CodeMirror').length !== 0) return; // to prevent duplicate editor

            let mode = null;
            let tags = null;
            switch (this.prop.text.editor) {
                case TextEditor.HtmlText:
                    mode = "htmlmixed";
                    tags = {
                        style: [["type", /^text\/(x-)?scss$/, "text/x-scss"], [null, null, "css"]],
                        custom: [[null, null, "customMode"]]
                    }
                    break;

                case TextEditor.Javascript:
                    mode = "javascript";
                    break;

                case TextEditor.Css:
                    mode = "text/x-scss";
                    break;

                case TextEditor.Json:
                    mode = "javascript";
                    break;

                case TextEditor.Xml:
                    mode = "application/xml";
                    break;

                case TextEditor.Markdown:
                    mode = "text/x-markdown";
                    break;
            }

            this.codeMirror = CodeMirror.fromTextArea(this.$refs.area, {
                tabSize: 4,
                readOnly: this.readOnly,
                lineNumbers: true,
                autoCloseTags: true,
                mode,
                tags
            });
            this.codeMirror.setValue(this.value);
            this.codeMirror.on("change", this.changed);
            this.codeMirror.on("focus", this.focus);
        }

        get value() {
            return getPropTextValue(this.prop, this.doc) || "";
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
            height: auto;
            max-width: 60rem;
        }
    }
</style>
