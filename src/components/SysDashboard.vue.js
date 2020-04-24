"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const DashboardInfoBox_vue_1 = tslib_1.__importDefault(require("@/components/DashboardInfoBox.vue"));
let SysDashboard = class SysDashboard extends vue_property_decorator_1.Vue {
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], SysDashboard.prototype, "prop", void 0);
SysDashboard = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        components: { DashboardInfoBox: DashboardInfoBox_vue_1.default }
    })
], SysDashboard);
exports.default = SysDashboard;
//# sourceMappingURL=SysDashboard.vue.js.map