"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
let WebSocket = class WebSocket extends vue_property_decorator_1.Vue {
    get glob() {
        return main_1.glob;
    }
    emit(command, ...args) {
        main_1.glob.socket.emit(command, ...args);
    }
    mounted() {
        if (main_1.glob.config.interactive) {
            console.log("web-socket initing ...");
            main_1.glob.socket.on('cmd', this.handleCommand);
        }
    }
    handleCommand(command, ...args) {
        switch (command) {
            case types_1.ClientCommand.Log:
                main_1.glob.logs.push({ message: args[0], type: args[1], ref: args[2] });
                break;
            case types_1.ClientCommand.PingAck:
                console.log('socket is ready');
                break;
            case types_1.ClientCommand.Notification:
                main.notify(args[0], args[1]);
                break;
            case types_1.ClientCommand.Question:
                main.question(args[0] /*questionid*/, args[1] /*message*/, args[2] /*options*/, (item) => {
                    main_1.glob.socket.emit('cmd', types_1.ClientCommand.Answer, args[0], item ? item.ref : null);
                });
                break;
            case types_1.ClientCommand.FunctionDone:
                main_1.glob.logs.push({ message: "done!", type: types_1.LogType.Info });
                main_1.glob.logs.push(null);
                break;
            case types_1.ClientCommand.Download:
                window.open(args[0], "_self");
                break;
            case types_1.ClientCommand.FunctionFailed:
                main_1.glob.logs.push({ message: args[0], type: types_1.LogType.Error });
                main_1.glob.logs.push(null);
                break;
        }
    }
};
WebSocket = tslib_1.__decorate([
    vue_property_decorator_1.Component
], WebSocket);
exports.default = WebSocket;
/script>;
//# sourceMappingURL=WebSocket.vue.js.map