"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main = tslib_1.__importStar(require("@/main"));
let FormView = class FormView extends vue_property_decorator_1.Vue {
    onScroll() {
        main.hideCmenu();
    }
};
FormView = tslib_1.__decorate([
    vue_property_decorator_1.Component
], FormView);
exports.default = FormView;
//# sourceMappingURL=FormView.vue.js.map