<template>
    <div v-if="glob.infoPanel.show" class="info-panel overflow-hidden border-left bg-light separator-line d-none d-lg-block">
        <button @click="glob.infoPanel.show=false" class="btn m-2 close-panel btn-link p-2"><i class="fal fa-times fa-lg"></i></button>

        <!-- Quick Notes -->
        <div class="url-notes px-3 mb-2" style="border-bottom: 2px solid #ccc">
            <h5>Quick Notes</h5>
            <div v-if="glob.infoPanel.notes.length">
                <div class="border-primary border border-2 p-1 mb-2" v-for="note of glob.infoPanel.notes">
                    <button @click="menu($event,note)" class="btn btn-link p-0 pr-1"><i class="fad fa-tags text-primary"></i></button>
                    {{note.content}}
                </div>
            </div>
            <textarea v-model="newNote" rows="4" class="bg-transparent new-note border-0 w-100" placeholder="Write your Quick Note here ..."></textarea>
            <button @click="submit" v-if="newNote" class="btn btn-outline-primary py-0 w-100 my-2">Submit</button>
        </div>

        <!-- Help -->
        <div v-if="glob.infoPanel.currentComment" class="py-2 px-3">
            <div v-html="comment()"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {$t, call, glob, markDown, showCmenu} from "../main";
    import {MenuItem} from "../types";

    declare let moment: any;

    @Component({name: 'InfoPanel'})
    export default class InfoPanel extends Vue {
        private newNote: string = null;

        menu(e, note) {
            let items: MenuItem[] = [
                {ref: null, title: moment(note.time).format("DD MMM, HH:mm")},
                {title: "-"},
                {ref: "share", title: $t('share')},
                {title: "-"},
                {ref: "delete", title: $t('delete')}
            ];
            showCmenu(note, items, e, (state, menu: MenuItem) => {
                    switch (menu.ref) {
                        case "delete":
                            call("deleteNote", {note: state._id}, (err, res) => {
                                glob.infoPanel.notes.splice(glob.infoPanel.notes.indexOf(note), 1);
                            });
                            break;

                        case "share":
                            break;
                    }
                }
            );
        }

        submit() {
            let url = location.pathname;
            url = url.replace(/^(\/.+\/.+)\/?.+/, "$1");
            call("submitNote", {content: this.newNote, url}, (err, res) => {
                this.newNote = null;
                glob.infoPanel.notes.push(res.data);
            });
        }

        comment() {
            return markDown(glob.infoPanel.currentComment);
        }
    }
</script>

<style lang="scss">
    .info-panel {
        min-width: 15rem;
        width: 20rem;
        font-size: smaller;
    }

    @media (min-width: 1200px) {
        .info-panel {
            width: 30rem;
        }
    }
</style>