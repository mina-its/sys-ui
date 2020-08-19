<template>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ClientCommand, LogType, Pair} from '../../../sys/src/types';
    import {glob} from '@/main';
    import * as main from '../main';

    @Component({name: 'WebSocket'})
    export default class WebSocket extends Vue {
        get glob() {
            return glob;
        }

        public emit(command: string, ...args) {
            glob.socket.emit(command, ...args);
        }

        mounted() {
            if (glob.config.interactive) {
                // console.log("web-socket initing ...");
                if (glob.socket)
                    glob.socket.on('cmd', this.handleCommand);
                else
                    console.warn('WebSocket: glob.socket is null!');
            }
        }

        handleCommand(command: ClientCommand, ...args: any[]) {
            switch (command) {
                case ClientCommand.Log:
                    glob.logs.push({message: args[0], type: args[1], ref: args[2]});
                    break;

                case ClientCommand.PingAck:
                    console.log('socket is ready');
                    break;

                case ClientCommand.Notification:
                    main.notify(args[0], args[1]);
                    break;

                case ClientCommand.Question:
                    main.question(args[0] /*title*/, args[1] /*message*/, args[2] /*buttons*/, {questionId: args[3]}, (ref: string) => {
                        glob.socket.emit('cmd', ClientCommand.Answer, args[3], ref);
                    });
                    break;

                case ClientCommand.FunctionDone:
                    glob.logs.push({message: "done!", type: LogType.Info});
                    glob.logs.push(null);
                    break;

                case ClientCommand.Download:
                    window.open(args[0]);
                    break;

                case ClientCommand.FunctionFailed:
                    glob.logs.push({message: args[0], type: LogType.Error});
                    glob.logs.push(null);
                    break;
            }
        }
    }
</script>
