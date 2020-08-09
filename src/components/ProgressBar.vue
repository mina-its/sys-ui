<template>
    <div :class="{'progress w-100 position-absolute':1, 'start':glob.showProgress}">
        <div class="progress-bar" role="progressbar"></div>
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
        height: 5px !important;
        top: 0;
        background-color: inherit !important;

        .progress-bar {
            width: 0;
            opacity: 0;
        }

        &.start .progress-bar {
            animation-name: progress-bar-anim;
            animation-duration: 5s;
        }
    }

    @keyframes progress-bar-anim {
        0% {
            width: 0;
            opacity: 1;
        }
        5% {
            width: 0;
        }
        10% {
            width: 50%;
        }
        50% {
            width: 75%;
        }
        100% {
            width: 100%;
        }
    }
</style>
