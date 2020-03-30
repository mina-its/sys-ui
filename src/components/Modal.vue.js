import { __decorate } from "tslib";
import FormElem from "@/components/FormElem.vue";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { glob } from "@/main";
const main = require("@/main");
let Modal = class Modal extends Vue {
    mounted() {
        glob.modal = true;
        $(".my-modal").modal().on('hidden.bs.modal', function () {
            glob.modal = false;
            main.load(location.href);
        });
    }
};
__decorate([
    Prop()
], Modal.prototype, "title", void 0);
__decorate([
    Prop()
], Modal.prototype, "footerElems", void 0);
__decorate([
    Prop()
], Modal.prototype, "bodyElems", void 0);
Modal = __decorate([
    Component({
        components: { FormElem }
    })
], Modal);
export default Modal;
//# sourceMappingURL=Modal.vue.js.map