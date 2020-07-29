<template>
    <div class="log-terminal w-100 bg-dark overflow-auto h-100 small">
        <div class="d-flex w-100 h-100">
            <div class="p-2 flex-fill overflow-auto h-100">
                <template v-for="log in glob.logs">
                    <div v-if="log" v-focus="true" tabindex="1" :class="'log-terminal-item type-'+log.type">{{log.message}}
                    </div>
                    <div v-else class="mb-5"></div>
                </template>
            </div>
            <div class="p-2">
                <button title="Clear the terminal" class="btn btn-secondary clear-button" @click="clear"><i class="fal fa-trash"></i></button>
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

        .clear-button {
            right: 1.5rem;
            top: 12.5rem;
        }

        .log-terminal-item {
            white-space: pre-wrap;
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
