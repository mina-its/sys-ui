<template>
    <div class="app-docs h-100 d-flex flex-column w-100">
        <!--  Toolbar -->
        <div :class="{'d-flex p-2 align-items-center btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

            <!--  Breadcrumb -->
            <Breadcrumb :breadcrumb="breadcrumb" :title="doc.title"/>

            <div class="mr-auto"/>

            <!--  Preferences -->
            <button class="btn btn-link text-secondary px-2" @click="clickpreferences"><i class="fal fa-cog fa-lg"></i></button>

            <!-- Info Panel -->
            <button title="Show info panel" v-if="!glob.infoPanel.show" @click="glob.infoPanel.show=true" class="btn close-panel btn-link px-2"><i class="fal fa-info-circle fa-lg"></i></button>
        </div>

        <!--  Content -->
        <div class="w-100 d-flex overflow-auto h-100">
            <!--  Side Menu -->
            <aside v-if="directory" class="border-right separator-line p-4 bg-white d-none d-xl-block">
                <div class="font-weight-bold py-3">{{directoryTitle}}</div>
                <tree :items="directory" @select="goto"/>
            </aside>

            <!--  Main -->
            <div class="border-left ml-md-5 w-100 separator-line bg-white overflow-auto d-flex">
                <h4 class="text-danger font-weight-bold" v-if="!doc">
                    Document not found!
                </h4>

                <div class="w-100 h-0">
                    <!-- Content -->
                    <div class="container p-md-5 p-sm-0">
                        <div class="text-justify" v-html="docContent"></div>
                    </div>

                    <hr class="my-5">

                    <!-- Feedback -->
                    <div class="ml-5 pb-5 feedback-part" style="margin-bottom: 30rem">
                        <div class="container">
                            <i class="fal fa-comment-alt-exclamation fa-2x px-1 m-2"></i>
                            <div v-if="showHelpUseful" class="d-flex align-items-center flex-wrap">
                                <div class="text-nowrap font-weight-bold m-2">Was this article helpful?</div>
                                <button @click="wasHelpful(true)" class="btn btn-outline-secondary px-4 m-2 py-1">Yes</button>
                                <button @click="wasHelpful(false)" class="btn btn-outline-secondary px-4 m-2 py-1">No</button>
                            </div>

                            <!-- Help Improvement -->
                            <div v-if="showHelpImprovement" class="m-2">
                                <div class="font-weight-bold">How can we improve it?</div>
                                <textarea v-model="feedbackComment" class="border my-2 w-50" rows="5"/>
                                <div>
                                    <button @click="submitFeedback" class="btn btn-primary">Submit</button>
                                </div>
                            </div>

                            <div v-if="!showHelpImprovement && !showHelpUseful" class="font-weight-bold m-2">Thanks for your feedback.</div>

                            <a class="m-2" target="_blank" :href="`/documents/${doc._id}`">Edit this page!</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {call, glob, markDown} from "../main";
    import {TreePair, Pair, Document} from '../../../sys/src/types';

    @Component({name: 'AppDocs'})
    export default class AppDocs extends Vue {
        private doc = new Document();
        private directoryTitle: string = null;
        private directory: TreePair[] = [];
        private breadcrumb: Pair[];

        private showHelpUseful: boolean = true;
        private showHelpImprovement: boolean = false;
        private feedbackComment: string = null;

        created() {
            this.loadDoc(location.pathname);
        }

        submitFeedback() {
            this.showHelpImprovement = false;
            call('sendFeedback', {url: location.href, tag: "document-end", path: location.pathname, comment: this.feedbackComment || "[empty]"}, (err, res) => {
                this.feedbackComment = "";
            });
        }

        wasHelpful(state) {
            this.showHelpUseful = false;
            this.showHelpImprovement = true;

            call('sendFeedback', {url: location.href, tag: "document-end", path: location.pathname, value: state ? "helpful" : "unhelpful"}, (err, res) => {
            });
        }

        loadDoc(ref: string) {
            this.showHelpUseful = true;

            let name = ref.replace(/.+\/docs\/([\w-]+).*/, "$1");
            if (!name) return;
            call('getDocument', {name}, (err, res) => {
                if (!res.data) {
                    this.doc = null;
                    return;
                }

                this.doc = res.data.doc;
                this.directory = res.data.directory;
                this.directoryTitle = res.data.directoryTitle;

                this.breadcrumb = [{title: this.directoryTitle, ref: null}];

                let content = (this.doc && this.doc.content) ? this.doc.content as string : "";
                let reg = /## (.+)\b/g;
                let onThisPage = "##### On this page: <br><br>\r\n";
                let result;
                while ((result = reg.exec(content)) !== null) {
                    onThisPage += `###### [${result[1]}](${'#' + result[1].toLowerCase().replace(/\s/, '-')})\r\n`;
                }
                glob.infoPanel.currentComment = onThisPage;
            });
        }

        goto(item: TreePair) {
            this.loadDoc(item.ref);
        }

        get docContent() {
            let content = this.doc ? this.doc.content as string : "";
            return markDown(content, true) || "Empty Document";
        }

        clickpreferences() {

        }
    }
</script>

<style lang="scss">
    .app-docs {
        h1 {
            margin: 2rem 0 1rem 0;
        }

        h2 {
            margin: 2rem 0 1rem 0;
        }

        em {
            color: red;
        }

        .nav-link {
            padding-left: 0;
        }
    }
</style>