<template>
    <div class="dropdown" title="Feedback">
        <a id="feedbackButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="text-white">
            <i class="fal fa-comment-alt-exclamation px-1"></i>
            <span class="">Feedback</span>
        </a>
        <div class="dropdown-menu dropdown-menu-right filter-panel p-3" aria-labelledby="feedbackButton" style="width: 30rem">
            <form>
                <div class="mr-2">How much are you satisfied?</div>
                <div class="my-2">
                    <i class="fal fa-tired pr-2 fa-lg"></i>
                    <i class="fal fa-frown px-2 fa-lg"></i>
                    <i class="fal fa-meh px-2 fa-lg"></i>
                    <i class="fal fa-smile px-2 fa-lg"></i>
                    <i class="fal fa-laugh-beam px-2 fa-lg"></i>
                </div>
                <div class="mr-2">Your requests:</div>
                <textarea placeholder="Comment" class="w-100 p-2"></textarea>
                <button @click="postFeedback" class="btn btn-success px-4 mt-2">Post</button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({name: 'AppFeedback'})
    export default class AppFeedback extends Vue {
        postFeedback() {

        }
    }
</script>