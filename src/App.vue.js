"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("./main");
const types_1 = require("../../sys/src/types");
let App = class App extends vue_property_decorator_1.Vue {
    mounted() {
        console.log(`%c mina framework started. %c version: ${main_1.glob.config.version} %c`, 'background:#05B ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#0072C6 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
    }
    get objectElem() {
        if (main_1.glob.form.elems && main_1.glob.form.elems.length == 1 && main_1.glob.form.elems[0].type == types_1.ElemType.Object)
            return main_1.glob.form.elems[0];
        else
            return null;
    }
};
App = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: "App", components: {} })
], App);
exports.default = App;
//# sourceMappingURL=App.vue.js.map