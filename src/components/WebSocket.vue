<template>
</template>

<script lang="ts">
	import {AppStateLog} from "@/types";
	import {Component, Vue} from 'vue-property-decorator';
	import {ClientCommand, LogType, Pair} from '../../../sys/src/types';

	declare let io: any;
	const main = require("./main");

	@Component
	export default class WebSocket extends Vue {
		private socket = io();

		public emit(command: string, ...args) {
			this.socket.emit(command, ...args);
		}

		mounted() {
			// console.log("web-socket initing ...");
			if (this.$store.state.config.interactive)
				this.socket.on('cmd', this.handleCommand);
		}

		handleCommand(command: ClientCommand, ...args: any[]) {
			switch (command) {
				case ClientCommand.Log:
					this.pushLog({message: args[0], type: args[1], ref: args[2]});
					break;

				case ClientCommand.PingAck:
					console.log('socket is ready');
					break;

				case ClientCommand.Notification:
					main.notify(args[0], args[1]);
					break;

				case ClientCommand.Question:
					main.question(args[0] /*questionid*/, args[1] /*message*/, args[2] /*options*/, (item: Pair) => {
						this.socket.emit('cmd', ClientCommand.Answer, args[0], item ? item.ref : null);
					});
					break;

				case ClientCommand.FunctionDone:
					this.pushLog({message: "done!", type: LogType.Info});
					this.pushLog(null);
					break;

				case ClientCommand.Download:
					window.open(args[0], "_self");
					break;

				case ClientCommand.FunctionFailed:
					this.pushLog({message: args[0], type: LogType.Error});
					this.pushLog(null);
					break;
			}
		}

		pushLog(log: AppStateLog) {
			this.$store.commit("pushLog", log);
		}
	}
</script>
