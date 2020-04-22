"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
let Markdown = class Markdown extends vue_property_decorator_1.Vue {
    get html() {
        return marked(this.content);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Markdown.prototype, "content", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Markdown.prototype, "styles", void 0);
Markdown = tslib_1.__decorate([
    vue_property_decorator_1.Component
], Markdown);
exports.default = Markdown;
//# sourceMappingURL=Markdown.vue.js.map