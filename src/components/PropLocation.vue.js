import { __decorate } from "tslib";
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { glob } from "@/main";
const main = require("@/main");
let PropLocation = class PropLocation extends Vue {
    changed() {
        return { prop: this.prop, val: this.value, vue: this };
    }
    changing() {
        let doc = this.doc;
        let changed = this.changed;
        glob.geoMap = {
            show: true,
            val: this.value,
            select: function (value) {
                doc[this.prop.name] = value;
                console.log(doc);
                changed();
            }
        };
    }
    get value() {
        return this.doc[this.prop.name];
    }
};
__decorate([
    Prop()
], PropLocation.prototype, "prop", void 0);
__decorate([
    Prop()
], PropLocation.prototype, "doc", void 0);
__decorate([
    Emit('changed')
], PropLocation.prototype, "changed", null);
PropLocation = __decorate([
    Component
], PropLocation);
export default PropLocation;
//# sourceMappingURL=PropLocation.vue.js.map