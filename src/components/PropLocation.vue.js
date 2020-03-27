import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let PropLocation = class PropLocation extends Vue {
    changed() {
        this.$emit("changed", prop(this), this.value);
    }
    changing() {
        let doc = this.doc;
        let changed = this.changed;
        st.geoMap = {
            show: true,
            val: this.value,
            select: function (value) {
                doc[prop(this).name] = value;
                console.log(doc);
                changed();
            }
        };
    }
    get value() {
        return this.doc[prop(this).name];
    }
};
__decorate([
    Prop()
], PropLocation.prototype, "meta", void 0);
__decorate([
    Prop()
], PropLocation.prototype, "doc", void 0);
PropLocation = __decorate([
    Component
], PropLocation);
export default PropLocation;
//# sourceMappingURL=PropLocation.vue.js.map