<template>
    <h1>TEST</h1>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Test extends Vue {
        @Prop() private prop!: string;
    }
</script>

<style scoped lang="scss">
    h1 {
        color: green;;
    }
</style>
