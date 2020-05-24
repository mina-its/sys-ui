<template>
    <input id="file-browse" type="file" class="d-none" @change="fileBrowsed" style="width: 0;height: 0;"
           multiple="true">
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';

    @Component({name: 'BrowseFile'})
    export default class BrowseFile extends Vue {
        fileBrowsed(e: InputEvent) {
            glob.fileBrowsed((e.target as HTMLInputElement).files);
        }

    }
</script>
