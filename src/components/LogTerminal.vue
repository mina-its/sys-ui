<template>
    <div class="log-terminal w-100 bg-dark overflow-auto h-100 small">
        <div class="w-100 h-100">
            <div class="p-2 position-absolute">
                <button title="Clear the terminal" class="btn btn-secondary" @click="clear"><i class="fal fa-trash"></i></button>
                <button title="Scroll to End" :class="{'btn mx-2':1, 'btn-light':scrollToEnd, 'btn-secondary':!scrollToEnd}" @click="scrollToEnd=!scrollToEnd"><i class="fal fa-arrow-alt-to-bottom"></i></button>
                <button title="Soft Wrap" :class="{'btn':1,'btn-light':softWrap,'btn-secondary':!softWrap}" @click="softWrap=!softWrap"><i class="fal fa-page-break"></i></button>
                <button title="Download" class="btn btn-secondary mx-2" @click="download"><i class="fal fa-download"></i></button>
            </div>
            <div class="p-2 flex-fill h-0" style="padding-top: 4rem!important;">
                <template v-for="log in glob.logs">
                    <div v-if="log" v-focus="scrollToEnd" tabindex="1" :class="'log-terminal-item type-'+log.type+(softWrap?' text-wrap':' text-nowrap')">{{log.message}}
                    </div>
                    <div v-else class="mb-5"></div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {$t, glob} from '@/main';
    import {ClientCommand, MenuItem} from '../../../sys/src/types';
    import WebSocket from "@/components/WebSocket.vue";
    import * as main from '../main';

    @Component({name: 'LogTerminal'})
    export default class LogTerminal extends Vue {
        @Prop() private prop!: string;

        private softWrap: boolean = true;
        private scrollToEnd: boolean = true;

        download() {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(glob.logs.map(log => log ? log.message : "").join("\r\n")));
            element.setAttribute('target', "_blank");
            element.setAttribute('download', "terminal.txt");
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        mounted() {
            if (glob.socket)
                glob.socket.emit(ClientCommand.Ping);
            else
                console.warn('glob.socket is null!');
            // WebSocket.call("emit", 'cmd', ClientCommand.Ping);
        }

        clear() {
            glob.logs = [];
        }
    }
</script>

<style lang="scss">
    .log-terminal {
        font-family: monospace;

        .log-terminal-item {
            color: gray;

            &:focus {
                outline: none;
            }

            &.type- {
                // Info
                &6 {
                    color: white;
                }

                // Warning
                &4 {
                    color: yellow;
                }

                // Error
                &3 {
                    color: red;
                }

                // Separator
                &0 {
                    margin-bottom: 1rem;
                }
            }
        }
    }
</style>
