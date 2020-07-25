<template>
    <input id="file-browse" type="file" class="d-none" @change="fileBrowsed" style="width: 0;height: 0;" multiple="true">
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from '@/main';
    import { mFile } from '../../../sys/src/types';

    @Component({name: 'BrowseFile'})
    export default class BrowseFile extends Vue {
        fileBrowsed(e: InputEvent) {
            let inputFiles = (e.target as HTMLInputElement).files;
            if (!inputFiles.length)
                glob.fileBrowsed([]);

            let files: mFile[] = [];
            for (const file of inputFiles) {
                files.push({
                    name: file.name,
                    size: file.size,
                    lastModified: file.lastModified,
                    type: file.type,
                    _: {
                        rawData: file as any,
                        uri: URL.createObjectURL(file)
                    }
                } as mFile);
            }
            glob.fileBrowsed(files);
        }

    }
</script>
