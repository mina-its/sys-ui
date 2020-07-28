<template>
    <div class="url-notes mb-2" style="border-bottom: 2px solid #ccc">
        <div class="glob.notes.length">
            <div v-for="note of glob.notes">
                {{note.content}}
                <button @click="menu($event,note)" class="btn btn-link p-0 "><i class="fal fa-ellipsis-h-alt text-black-50"></i></button>
                <hr class="my-2 border-primary" style="border-width: 2px">
            </div>
        </div>
        <textarea v-model="newNote" class="border-0 w-100" placeholder="Write your notes here ..."></textarea>
        <button @click="submit" v-if="newNote" class="btn btn-outline-primary py-0 w-100 my-2">Submit</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {$t, call, glob, showCmenu} from "../main";
    import {MenuItem} from "../types";
    import * as main from "../main";

    declare let moment: any;

    @Component({name: 'UrlNotes'})
    export default class UrlNotes extends Vue {
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
                                glob.notes.splice(glob.notes.indexOf(note), 1);
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
                glob.notes.push(res.data);
            });
        }
    }
</script>

<style lang="scss">
</style>