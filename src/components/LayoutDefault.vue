<template>
    <div class="layout layout-default w-100">
        <slot v-if="justContent" name="main-content"></slot>

        <div v-else class="h-100 d-flex w-100 flex-column">
            <!--  Toolbar -->
            <div class="d-flex p-2 align-items-center btn-toolbar toolbar" role="toolbar" aria-label="Toolbar with button groups">

                <!--  Breadcrumb -->
                <Breadcrumb :breadcrumb="glob.form.breadcrumb" :title="title||glob.form.breadcrumbLast"/>

                <slot name="toolbar-customs"></slot>

                <!--  Toolbar Apply/Cancel -->
                <ToolbarModifyButtons/>

                <!--  Inline message box -->
                <div v-show="glob.inlineMessage" class="inline-message-box mx-2 text-center small border-chip bg-gray">
                    <i class="fal mx-1 fa-lg fa-comment-alt-lines"></i>
                    <span>{{glob.inlineMessage}}</span>
                </div>

                <div class="mr-auto"></div>

                <slot name="toolbar-customs-end"></slot>

                <!--  Global functions -->
                <div class="mx-2 global-funcs">
                    <template v-for="func in globalFunctions">
                        <a :href="func.ref" :class="`${func.style||'btn border-chip btn-outline-primary mx-1 px-4'}`" v-if="func.ref">
                            <i class="fa"></i>
                            {{func.title}}
                        </a>
                        <Function v-else :styles="func.style||'btn-outline-secondary mx-1'" :name="func.name" @exec="func.exec" :title="func.title"/>
                    </template>
                </div>

                <div>
                    <!--  Object Menu -->
                    <button class="btn btn-link text-secondary px-2" @click="clickConfigMenu"><i class="fal fa-cog fa-lg"></i></button>

                    <!-- Info Panel -->
                    <button title="Show/Hide Info Panel" @click="toggleShowInfoPanel()" :class="{'btn close-panel btn-link px-2':1, 'disabled':this.hideInfoPanel}">
                        <i :class="{'fal fa-lg':1,'fa-arrow-alt-from-left text-secondary':showInfoPanel,'fa-arrow-alt-from-right':!showInfoPanel}"></i>
                    </button>
                </div>
            </div>

            <!--  Content -->
            <div class="w-100 d-flex h-100 overflow-auto">
                <!-- Nav Panel -->
                <aside v-if="showSideMenu" class="nav-panel bg-white border-end separator-line py-4 d-none overflow-auto d-md-block">
                    <slot name="side-menu"></slot>
                </aside>

                <!-- Main Content -->
                <div :class="{'flex-grow-1 main-bg-image main-content overflow-auto':1, 'p-4':!mainNoPadding}" @scroll="onScroll()">
                    <slot name="main-content"></slot>
                </div>

                <aside v-if="showInfoPanel && !hideInfoPanel" class="info-panel border-start separator-line bg-white">
                    <slot name="info-panel"></slot>

                    <!-- Quick Notes -->
                    <div v-if="showQuickNote" class="url-notes px-3 mb-2 border-2 border-bottom">
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
                </aside>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {GlobalFunction, MenuItem} from "../types";
    import {$t, call, glob, hideCmenu, load, markDown, showCmenu} from "../main";

    declare let moment: any;

    @Component({name: "LayoutDefault"})
    export default class LayoutDefault extends Vue {
        @Prop() private globalFunctions: GlobalFunction[];
        @Prop() private configMenu: MenuItem[];
        @Prop() private justContent: boolean;
        @Prop() private showSideMenu: boolean;
        @Prop() private showQuickNote: boolean;
        @Prop() private mainNoPadding: boolean;
        @Prop() private hideInfoPanel: boolean;
        @Prop() private title: string;
        private showInfoPanel = true;
        private newNote: string = null;

        created() {
            this.showInfoPanel = localStorage.getItem('show-info-panel') != "hide";
        }

        toggleShowInfoPanel() {
            if (this.hideInfoPanel) return;
            this.showInfoPanel = !this.showInfoPanel;
            localStorage.setItem('show-info-panel', !this.showInfoPanel ? "hide" : null);
        }

        @Emit('selectConfigMenuItem')
        selectConfigMenuItem(ref: string) {
            return ref;
        }

        onScroll() {
            hideCmenu();
        }

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

        clickConfigMenu(e) {
            let menu = this.configMenu || [{ref: "default-print", title: $t('print')}];
            showCmenu(null, menu, e, (state, item: MenuItem) => {
                switch (item.ref) {
                    case "default-print":
                        window.print();
                        break;

                    default:
                        this.selectConfigMenuItem(item.ref);
                        break;
                }
            });
        }

        // refresh() {
        //     load(location.pathname, false);
        // }
    }
</script>

<style lang="scss">
    .nav-panel {
        min-width: 12rem;
    }

    .inline-message-box {
        padding: 0.64rem 1rem;
        min-width: 13rem;
    }

    .info-panel {
        min-width: 20rem !important;
        width: 20rem;
    }

    @media (max-width: 576px) {
        aside.info-panel {
            min-width: 80% !important;
            width: 80%;
        }
    }
</style>