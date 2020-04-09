<template>
    <input id="file-browse" type="file" class="d-none" @change="fileBrowsed" style="width: 0;height: 0;"
           multiple="true">
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';;

    @Component
    export default class BrowseFile extends Vue {
        @Prop() private prop!: string;

        fileBrowsed(e: InputEvent) {
            glob.fileGallery.fileBrowsed((e.target as HTMLInputElement).files);

            // browseFile(fileBrowsed?: (files: any[]) => void) {
            //     glob.fileGallery.fileBrowsed = fileBrowsed;
            //     $('#file-browse').val('').click();
            // }
        }
    }
</script>

<style lang="scss">

</style>
