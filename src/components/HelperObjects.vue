<template>
    <section class="helpers-objects">
        <div id="snackbar"></div>
        <FileGallery/>
        <BrowseFile/>
        <NotifyBox/>
        <WebSocket/>
        <QuestionBox/>
        <ContextMenu/>
        <ProgressBar/>
        <GeoMap/>
    </section>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({name: 'HelperObjects'})
    export default class HelperObjects extends Vue {
    }
</script>
