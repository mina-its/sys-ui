<template>
    <div @focus="focus" class="prop-html-editor"></div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Property} from "../../../sys/src/types";
    import {ItemChangeEventArg, PropEventArg} from '@/types';

    declare let $: any;

    @Component({name: 'PropHtmlEditor'})
    export default class PropHtmlEditor extends Vue {
        @Prop() private doc: any;
        @Prop() private prop: Property;
        @Prop() private readOnly: boolean;

        mounted() {
            if ($(this.$el).next('.note-editor').length !== 0) return; // to prevent duplicate editor

            $(this.$el).summernote('code', this.doc[this.prop.name]);
            $(this.$el)
                .on("summernote.change", this.changed)
                .on('summernote.focus', this.focus);
            if (this.readOnly)
                $(this.$el).summernote('disable');
        }

        @Emit('changed')
        changed(): ItemChangeEventArg {
            let val = $(this.$el).summernote('code');
            return {prop: this.prop, val, vue: this};
        }

        @Emit('focus')
        focus(e): PropEventArg {
            return {prop: this.prop, event: e};
        }
    }
</script>

<style lang="scss">
    .prop-html-editor {
        width: 0;
        height: 0;
    }
</style>
