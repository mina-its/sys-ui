<template>
    <article contenteditable="true" @input="updateHTML" :class="'d-block border-0 '+ styles"></article>
</template>

<script lang="ts">
    declare let marked: any;
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';

    @Component({name: 'MarkdownEditable'})
    export default class MarkdownEditable extends Vue {
        @Prop() private content: string;
        @Prop() private styles: string;

        mounted() {
            this.$el.innerHTML = marked(this.content);
        }

        @Emit('input')
        updateHTML(e) {
            return {val: e.target.innerHTML};
        }
    }
</script>

<style scoped lang="scss">

</style>
