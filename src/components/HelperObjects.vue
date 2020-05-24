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
        <ImagePreview/>
    </section>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({name: 'HelperObjects', components: {}})
    export default class HelperObjects extends Vue {
    }
</script>
