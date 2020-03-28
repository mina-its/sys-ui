import { __decorate } from "tslib";
import { Component, Vue } from 'vue-property-decorator';
import { ClientCommand, LogType } from '../../../sys/src/types';
import { glob } from "@/main";
const main = require("./main");
let WebSocket = class WebSocket extends Vue {
    constructor() {
        super(...arguments);
        this.socket = io();
    }
    emit(command, ...args) {
        this.socket.emit(command, ...args);
    }
    mounted() {
        // console.log("web-socket initing ...");
        if (glob.config.interactive)
            this.socket.on('cmd', this.handleCommand);
    }
    handleCommand(command, ...args) {
        switch (command) {
            case ClientCommand.Log:
                glob.logs.push({ message: args[0], type: args[1], ref: args[2] });
                break;
            case ClientCommand.PingAck:
                console.log('socket is ready');
                break;
            case ClientCommand.Notification:
                main.notify(args[0], args[1]);
                break;
            case ClientCommand.Question:
                main.question(args[0] /*questionid*/, args[1] /*message*/, args[2] /*options*/, (item) => {
                    this.socket.emit('cmd', ClientCommand.Answer, args[0], item ? item.ref : null);
                });
                break;
            case ClientCommand.FunctionDone:
                glob.logs.push({ message: "done!", type: LogType.Info });
                glob.logs.push(null);
                break;
            case ClientCommand.Download:
                window.open(args[0], "_self");
                break;
            case ClientCommand.FunctionFailed:
                glob.logs.push({ message: args[0], type: LogType.Error });
                glob.logs.push(null);
                break;
        }
    }
};
WebSocket = __decorate([
    Component
], WebSocket);
export default WebSocket;
//# sourceMappingURL=WebSocket.vue.js.map