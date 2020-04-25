<template>
    <span class='prop-message text-danger' v-if="message">{{message}}</span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'PropMessage'})
    export default class PropMessage extends Vue {
        @Prop() private message: string;
    }
</script>

<style scoped lang="scss">

</style>
