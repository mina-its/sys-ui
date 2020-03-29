<template>
    <div class="p-2 log-terminal w-100 bg-dark" @contextmenu="openMenu">
        <div v-focus="true" tabindex="1" :class="'log-terminal-item type-'+log.type" v-for="log in glob.logs">
            {{log.message}}
        </div>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {$t, glob} from "@/main";
	import {ClientCommand, MenuItem} from '../../../sys/src/types';
	import WebSocket from "@/components/WebSocket.vue";

	const main = require("@/main");

	@Component
	export default class LogTerminal extends Vue {
		@Prop() private prop!: string;

		mounted() {
			WebSocket.call("emit", 'cmd', ClientCommand.Ping);
		}

		openMenu(e) {
			let items: MenuItem[] = [{ref: "clear", title: $t('clear')} as MenuItem];
			main.showCmenu(null, items, e, (state, item: MenuItem) => {
				switch (item.ref) {
					case "clear":
						glob.logs = [];
						break;
				}
			});
			e.preventDefault();
		}
	}
</script>

<style lang="scss">
    .log-terminal {
        font-family: monospace;
        height: 100%;
        overflow: auto;

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
