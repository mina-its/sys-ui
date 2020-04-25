<template>
    <div class="row">
        <div>{{file.name}}</div>
        <div>{{file.size}}</div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'FileDriveItem'})
    export default class FileDriveItem extends Vue {
        @Prop() private file: any;
    }
</script>
