<template>
    <div class="progress" v-if="glob.progress">
        <div class="progress-bar" role="progressbar" :style="{'width': glob.progress+'%'}"
             :aria-valuenow="glob.progress"
             aria-valuemin="0"
             aria-valuemax="100"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({name: 'ProgressBar'})
    export default class ProgressBar extends Vue {
    }
</script>

<style lang="scss">
    .progress {
        height: 3px !important;
        top: 0;
        background-color: inherit!important;
        position: absolute;
        width: 100%;
    }
</style>
