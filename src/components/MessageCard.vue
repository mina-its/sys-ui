<template>
    <div :class="'m-3 card text-white bg-' + type" style="max-width:18rem;">
        <div class="card-header">{{header}}</div>
        <div class="card-body">
            <p class="card-text">{{message}}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'MessageCard'})
    export default class MessageCard extends Vue {
        @Prop() private header: string;
        @Prop() private message: string;
        @Prop() private type: string;
    }
</script>

<style scoped lang="scss">

</style>
