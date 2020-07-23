<template>
    <div class="dropdown cursor-pointer" title="Feedback">
        <a id="feedbackButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="text-white">
            <i class="fal fa-comment-alt-exclamation px-1"></i>
            <span class="">Feedback</span>
        </a>
        <div class="dropdown-menu dropdown-menu-right filter-panel p-5" aria-labelledby="feedbackButton" style="width: 30rem">
            <form>
                <div class="mr-2 font-weight-bold">How is experience going?</div>
                <div class="mr-2 small">Your feedback helps us improve.</div>
                <div class="my-2 py-3" v-if="showOverall">
                    <button title="Awful!" @click="postOverall('awful')" class="btn btn-link"><i class="fal fa-tired fa-2x"></i></button>
                    <button title="Not Good!" @click="postOverall('not-good')" class="btn btn-link"><i class="fal fa-frown fa-2x"></i></button>
                    <button title="Average!" @click="postOverall('average')" class="btn btn-link"><i class="fal fa-meh fa-2x"></i></button>
                    <button title="Good!" @click="postOverall('good')" class="btn btn-link"><i class="fal fa-smile fa-2x"></i></button>
                    <button title="Perfect!" @click="postOverall('perfect')" class="btn btn-link"><i class="fal fa-laugh-beam fa-2x"></i></button>
                </div>
                <div v-if="showComments">
                    <div class="font-weight-bold">How can we improve it?</div>
                    <textarea v-model="feedbackComment" class="w-100 p-2"></textarea>
                    <button @click="postFeedback" class="btn btn-success px-4 mt-2">Post</button>
                </div>
                <div v-if="!showComments && !showOverall" class="font-weight-bold m-2">Thanks for your feedback.</div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {call} from "../main";

    @Component({name: 'AppFeedback'})
    export default class AppFeedback extends Vue {
        private feedbackComment: string = null;
        private showOverall = true;
        private showComments = false;

        postOverall(value) {
            this.showOverall = false;
            this.showComments = true;

            call('sendFeedback', {url: location.href, tag: "global", path: location.pathname, value}, (err, res) => {
            });
        }

        postFeedback() {
            this.showComments = false;
            call('sendFeedback', {url: location.href, tag: "document-end", path: location.pathname, comment: this.feedbackComment || "[empty]"}, (err, res) => {
                this.feedbackComment = "";
            });
        }
    }
</script>