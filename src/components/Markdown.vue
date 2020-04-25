<template>
    <article v-html="html" :class="'d-block border-0 '+ styles"></article>
</template>

<script lang="ts">
    declare let marked: any;
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'Markdown'})
    export default class Markdown extends Vue {
        @Prop() private content: string;
        @Prop() private styles: string;

        get html() {
            return marked(this.content);
        }
    }
</script>

<style scoped lang="scss">

</style>
