<template>
    <CheckBox :checked="true" label="Check"></CheckBox>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import CheckBox from "@/components/CheckBox.vue";

    @Component({
        components: {CheckBox}
    })
    export default class Test2 extends Vue {

    }
</script>

<style scoped lang="scss">
    h1 {
        color: red;;
    }
</style>
