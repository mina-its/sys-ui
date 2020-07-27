<template>
    <div class="p-2 log-terminal w-100 bg-dark position-relative">
        <template v-for="log in glob.logs">
            <div v-if="log" v-focus="true" tabindex="1" :class="'log-terminal-item type-'+log.type">{{log.message}}
            </div>
            <div v-else class="mb-5"></div>
        </template>
        <button title="Clear the terminal" class="btn btn-link text-white clear-button position-absolute" @click="clear"><i class="fal fa-trash"></i></button>
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
            glob.socket.emit(ClientCommand.Ping);
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
        height: 100%;
        font-size: small;
        overflow: auto;

        .clear-button {
            right: 1rem;
            top: 1rem;
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
