"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class {
};
"sys-dashboard" >
    class {
    };
"d-flex" >
    title;
"CPU Usage";
value = "data.cpuUsage";
icon = "fa-gear";
color = "#00c0ef";
class {
}
"m-4" > /DashboardInfoBox>
    < DashboardInfoBox_vue_1.default;
title = "Objects";
value = "data.objectsCount";
icon = "fa-anchor";
color = "#00a65a";
class {
}
"m-4" > /DashboardInfoBox>
    < DashboardInfoBox_vue_1.default;
title = "Functions";
value = "data.functionsCount";
icon = "fa-bell-slash";
color = "#dd4b39";
class {
}
"m-4" > /DashboardInfoBox>
    < DashboardInfoBox_vue_1.default;
title = "Users";
value = "data.usersCount";
icon = "fa-user-circle-o";
color = "#f39c12";
class {
}
"m-4" > /DashboardInfoBox>
    < /div>
    < div;
class {
}
"p-4" >
    class {
    };
"world-map p-4 bg-white" >
    src;
"/images/world.svg" >
    /div>
    < /div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const DashboardInfoBox_vue_1 = tslib_1.__importDefault(require("@/components/DashboardInfoBox.vue"));
let SysDashboard = class SysDashboard extends vue_property_decorator_1.Vue {
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], SysDashboard.prototype, "data", void 0);
SysDashboard = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        components: { DashboardInfoBox: DashboardInfoBox_vue_1.default }
    })
], SysDashboard);
exports.default = SysDashboard;
/script>
    < style;
scoped;
lang = "scss" >
        .sys - dashboard;
{
    width: 100 % ;
}
world - map;
{
    width: 100 % ;
    border - bottom;
    1;
    px;
    solid;
    #f4f4f4;
    box - shadow;
    0;
    1;
    px;
    1;
    px;
    rgba(0, 0, 0, 0.1);
    border - top;
    3;
    px;
    solid;
    #;
    00;
    a65a;
    border - radius;
    3;
    px;
}
world - map;
img;
{
    width: 100 % ;
}
/style>;
//# sourceMappingURL=SysDashboard.vue.js.map