"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("../main");
;
const types_1 = require("../../../sys/src/types");
const WebSocket_vue_1 = tslib_1.__importDefault(require("@/components/WebSocket.vue"));
const main = tslib_1.__importStar(require("../main"));
let LogTerminal = class LogTerminal extends vue_property_decorator_1.Vue {
    mounted() {
        WebSocket_vue_1.default.call("emit", 'cmd', types_1.ClientCommand.Ping);
    }
    openMenu(e) {
        let items = [{ ref: "clear", title: main_1.$t('clear') }];
        main.showCmenu(null, items, e, (state, item) => {
            switch (item.ref) {
                case "clear":
                    main_1.glob.logs = [];
                    break;
            }
        });
        e.preventDefault();
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], LogTerminal.prototype, "prop", void 0);
LogTerminal = tslib_1.__decorate([
    vue_property_decorator_1.Component
], LogTerminal);
exports.default = LogTerminal;
//# sourceMappingURL=LogTerminal.vue.js.map