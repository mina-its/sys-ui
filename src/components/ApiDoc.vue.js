"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
let ApiDoc = class ApiDoc extends vue_property_decorator_1.Vue {
    getOprId(block, opr) {
        return 'oper-' + block.name + '-' + opr.method + "-" + opr.uri.replace(/\//g, '-');
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], ApiDoc.prototype, "data", void 0);
ApiDoc = tslib_1.__decorate([
    vue_property_decorator_1.Component
], ApiDoc);
exports.default = ApiDoc;
//# sourceMappingURL=ApiDoc.vue.js.map