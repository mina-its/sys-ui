<template>
    <div></div>
</template>

<script lang="ts">
	declare let io: any;
	import {Component, Vue} from 'vue-property-decorator';
	import {glob, st} from "@/main";
	import {ClientCommand, LogType, Pair} from '../../../sys/src/types';

	const main = require("./main");

	@Component
	export default class WebSocket extends Vue {

		mounted() {
			// console.log("web-socket initing ...");
			if (st.config.interactive) {
				glob.io = io();
				glob.io.on('cmd', this.handleCommand);
			}
		}

		handleCommand(command: ClientCommand, ...args: any[]) {
			switch (command) {
				case ClientCommand.Log:
					st.logs.push({message: args[0], type: args[1], ref: args[2]});
					break;

				case ClientCommand.PingAck:
					console.log('socket is ready');
					break;

				case ClientCommand.Notification:
					main.notify(args[0], args[1]);
					break;

				case ClientCommand.Question:
					main.question(args[0] /*questionid*/, args[1] /*message*/, args[2] /*options*/, (item: Pair) => {
						glob.io.emit('cmd', ClientCommand.Answer, args[0], item ? item.ref : null);
					});
					break;

				case ClientCommand.FunctionDone:
					st.logs.push({message: "done!", type: LogType.Info});
					st.logs.push(null);
					break;

				case ClientCommand.Download:
					window.open(args[0], "_self");
					break;

				case ClientCommand.FunctionFailed:
					st.logs.push({message: args[0], type: LogType.Error});
					st.logs.push(null);
					break;
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
