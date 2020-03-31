import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { LogType, ObjectViewType } from "../../../sys/types";
import { glob } from '@/main';
const main = require("@/main");
let ObjectView = class ObjectView extends Vue {
    render(ce) {
        let e = this.elem;
        //console.log("object-view:" + e.obj.ref);
        if (!e.obj) {
            main.notify("Element 'object-view' needs obj property.", LogType.Error);
            return;
        }
        const data = glob.form.dataset[e.obj.ref];
        const dec = glob.form.declarations[e.obj.ref];
        glob.form.toolbar = true;
        let rt = this.root == null ? true : this.root;
        if (e.obj && e.obj.type == ObjectViewType.TreeView)
            return ce('tree-view', { props: { uri: e.obj.ref } });
        else
            return Array.isArray(data) ?
                ce('grid-view', { props: { uri: e.obj.ref, root: rt, dec, items: data } }) :
                ce('details-view', { props: { uri: e.obj.ref, root: rt, dec } });
    }
};
__decorate([
    Prop()
], ObjectView.prototype, "elem", void 0);
__decorate([
    Prop()
], ObjectView.prototype, "root", void 0);
ObjectView = __decorate([
    Component
], ObjectView);
export default ObjectView;
//# sourceMappingURL=ObjectView.vue.js.map