"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FormElem_vue_1 = tslib_1.__importDefault(require("@/components/FormElem.vue"));
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("../main");
const main = tslib_1.__importStar(require("../main"));
let Modal = class Modal extends vue_property_decorator_1.Vue {
    close() {
        main_1.glob.modal = false;
        main.load(location.href);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Modal.prototype, "title", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Modal.prototype, "footerElems", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Modal.prototype, "bodyElems", void 0);
Modal = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        name: 'modal',
        components: { FormElem: FormElem_vue_1.default }
    })
], Modal);
exports.default = Modal;
//# sourceMappingURL=Modal.vue.js.map