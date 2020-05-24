<template>
    <div v-if="glob.imagePreview.show" class="image-preview">
        <div class="modal-mask" @click="glob.imagePreview.show=false">
            <div class="modal-wrapper align-middle text-center">
                <img :src="glob.imagePreview.url"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectViewType} from "../../../sys/src/types";

    @Component({name: 'ImagePreview'})
    export default class ImagePreview extends Vue {

    }
</script>

<style lang="scss">
    .image-preview {
        .modal-mask {
            background-color: rgba(0, 0, 0, 0.9);
        }
    }
</style>
