<template>
    <Root></Root>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Root from "@/components/Root.vue";

    @Component({
        components: {Root}
    })
    export default class App extends Vue {
    }
</script>
