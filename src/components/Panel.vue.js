"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main_1 = require("@/main");
let Panel = class Panel extends vue_property_decorator_1.Vue {
    render(ce) {
        let e = this.elem;
        let elems = e.panel.elems || [];
        switch (e.panel.type) {
            case types_1.PanelType.Modal:
                let bodyElems = e.panel.elems.filter(el => el.type !== types_1.ElemType.Function);
                let footerElems = e.panel.elems.filter(el => el.type === types_1.ElemType.Function);
                main_1.glob.modal = true;
                return ce('modal', {
                    props: {
                        title: e.title,
                        bodyElems,
                        footerElems,
                    }
                });
            case types_1.PanelType.Stack: {
                let children = elems.map((elem) => {
                    return ce("elem", { props: { elem } });
                });
                let horizontal = e.panel.stack && e.panel.stack.orientation == types_1.Orientation.Horizontal;
                return ce('div', {
                    attrs: {
                        class: "d-flex " + (horizontal ? "flex-row" : "flex-column") + " " + e.styles
                    }
                }, children);
            }
            case types_1.PanelType.Wrap: {
                let children = elems.map((elem) => {
                    return ce("elem", { props: { elem } });
                });
                return ce('div', {
                    attrs: {
                        class: e.styles
                    }
                }, children);
            }
            case types_1.PanelType.Flex: {
                let children = elems.map((elem) => {
                    return ce("elem", { props: { elem } });
                });
                return ce('div', {
                    attrs: {
                        class: "d-flex " + e.styles
                    }
                }, children);
            }
        }
        return ce('div');
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Panel.prototype, "elem", void 0);
Panel = tslib_1.__decorate([
    vue_property_decorator_1.Component
], Panel);
exports.default = Panel;
//# sourceMappingURL=Panel.vue.js.map