<template>
    <div class="app-docs h-100 d-flex flex-column w-100">
        <!--  Toolbar -->
        <div :class="{'d-flex p-2 align-items-center btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

            <!--  Breadcrumb -->
            <Breadcrumb :breadcrumb="breadcrumb" :title="doc.title"/>

            <div class="mr-auto"/>

            <!--  Preferences -->
            <button class="btn btn-link text-secondary px-2" @click="clickpreferences"><i class="fal fa-cog fa-lg"></i></button>
        </div>

        <!--  Content -->
        <div class="w-100 d-flex overflow-auto">
            <!--  Side Menu -->
            <aside v-if="directory" class="border-right separator-line p-4 bg-white d-none d-md-block">
                <div class="font-weight-bold py-3">{{directoryTitle}}</div>
                <tree :items="directory" @select="goto"/>
            </aside>

            <!--  Main -->
            <div class="border-left ml-5 w-100 separator-line bg-white overflow-auto d-flex">
                <h4 class="text-danger font-weight-bold" v-if="!doc">
                    Document not found!
                </h4>

                <div class="w-100 h-100">
                    <!-- Content -->
                    <div class="container p-5">
                        <div class="text-justify" v-html="docContent"></div>
                    </div>

                    <hr class="my-5">

                    <!-- Feedback -->
                    <div class="ml-5 pb-5 feedback-part" style="margin-bottom: 10rem">
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

                <!--  Inside doc -->
                <div v-if="onThisPage" class="inside-doc sticky-top border-left text-dark py-4" style="min-width: 15rem">
                    <h6 class="text-nowrap font-weight-bold px-4 py-2">On this page</h6>
                    <hr>
                    <tree class="" :items="onThisPage" @select="goto"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {call, markDown} from "../main";
    import {TreePair, Pair, Document} from '../../../sys/src/types';

    @Component({name: 'AppDocs'})
    export default class AppDocs extends Vue {
        private doc = new Document();
        private directoryTitle: string = null;
        private directory: TreePair[] = [];
        private onThisPage: TreePair[] = null;
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

            let parts = ref.split('/');
            if (parts.length != 3) return;
            call('getDocument', {name: parts[2]}, (err, res) => {
                if (!res.data) {
                    this.doc = null;
                    return;
                }

                this.doc = res.data.doc;
                this.directory = res.data.directory;
                this.directoryTitle = res.data.directoryTitle;

                this.breadcrumb = [{title: this.directoryTitle, ref: null}];

                this.onThisPage = null;
                let content = (this.doc && this.doc.content) ? this.doc.content as string : "";
                let reg = /## (.+)\b/g;
                let result;
                while ((result = reg.exec(content)) !== null) {
                    this.onThisPage = this.onThisPage || [];
                    this.onThisPage.push({title: result[1], ref: '#' + result[1].toLowerCase().replace(/\s/, '-')});
                }
            });
        }

        goto(item: TreePair) {
            this.loadDoc(item.ref);
        }

        get docContent() {
            let content = (this.doc && this.doc.content) ? this.doc.content as string : "";
            content = content.replace(/\*\*Note\*\*(\s+.+\s)/g, "<div class='document-note'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Note</strong>\r\n$1</div>");
            content = content.replace(/\*\*Tip\*\*(\s+.+\s)/g, "<div class='document-note'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Tip</strong>\r\n$1</div>");

            content = content ? markDown(content) : "Empty Docuemnt";
            return content;
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

        .document-note {
            padding: 1rem;
            border: 1px solid rgba(0, 115, 187, .35);
            background-color: rgba(241, 250, 255, .8);
        }
    }
</style>