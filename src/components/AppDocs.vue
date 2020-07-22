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
        <div class="w-100 h-100 d-flex">
            <!--  Side Menu -->
            <aside v-if="directory" class="border-right separator-line p-4 bg-white d-none d-md-block">
                <div class="font-weight-bold py-3">{{directoryTitle}}</div>
                <tree :items="directory" @select="goto"></tree>
            </aside>

            <!--  Main -->
            <div class="border-left w-100 separator-line ml-4 bg-white">
                <h4 class="text-danger font-weight-bold" v-if="!doc">
                    Document not found!
                </h4>

                <div class="w-100 h-100">
                    <!-- Content -->
                    <div class="container py-5 text-justify ml-5" v-html="docContent">
                    </div>

                    <hr class="my-5">

                    <!-- Feedback -->
                    <div class="container  ml-5 feedback-part">
                        <i class="fal fa-comment-alt-exclamation fa-2x px-1 m-2"></i>
                        <div v-if="showHelpUseful" class="d-flex align-items-center flex-wrap">
                            <div class="text-nowrap font-weight-bold m-2">Was this document helpful?</div>
                            <button @click="wasHelpful(true)" class="btn btn-outline-secondary px-4 m-2 py-1">Yes</button>
                            <button @click="wasHelpful(false)" class="btn btn-outline-secondary px-4 m-2 py-1">No</button>
                        </div>

                        <!-- Help Improvement -->
                        <div v-if="showHelpImprovement" class="m-2">
                            <div class="font-weight-bold">How can we improve it?</div>
                            <textarea class="border my-2 w-50" rows="5"/>
                            <div>
                                <button @click="submitFeedback" class="btn btn-primary">Submit</button>
                            </div>
                        </div>

                        <div v-if="!showHelpImprovement && !showHelpUseful" class="font-weight-bold m-2">Thanks for your feedback.</div>
                    </div>

                    <!--  Inside doc -->
                    <div class="bg-white d-none d-md-block">
                    </div>
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
        private breadcrumb: Pair[];

        private showHelpUseful: boolean = true;
        private showHelpImprovement: boolean = false;

        created() {
            this.loadDoc(location.pathname);
        }

        submitFeedback() {
            this.showHelpImprovement = false;
        }

        wasHelpful(state) {
            this.showHelpUseful = false;
            this.showHelpImprovement = true;
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

                this.breadcrumb = [{title: this.directoryTitle, red: null}];
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
            margin-bottom: 2rem;
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