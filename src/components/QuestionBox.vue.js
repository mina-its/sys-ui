"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Function_vue_1 = tslib_1.__importDefault(require("@/components/Function.vue"));
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
let QuestionBox = class QuestionBox extends vue_property_decorator_1.Vue {
    close() {
        main_1.glob.question.show = false;
        if (main_1.glob.question.options.length)
            main_1.glob.question.select(null);
    }
    select(e) {
        let option = e.data;
        main_1.glob.question.select(option);
        main_1.glob.question.options = []; // to not send again null
        main_1.glob.question.show = false;
    }
    get message() {
        if (main_1.glob.question.message)
            return marked(main_1.glob.question.message);
        else
            return "";
    }
};
QuestionBox = tslib_1.__decorate([
    vue_property_decorator_1.Component({ components: { Function: Function_vue_1.default } })
], QuestionBox);
exports.default = QuestionBox;
//# sourceMappingURL=QuestionBox.vue.js.map