import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
let Panel = class Panel extends Vue {
    render(ce) {
        let e = this.elem;
        let elems = e.panel.elems || [];
        switch (e.panel.type) {
            case PanelType.Modal:
                let bodyElems = e.panel.elems.filter(el => el.type !== ElemType.Function);
                let footerElems = e.panel.elems.filter(el => el.type === ElemType.Function);
                return ce('modal', {
                    props: {
                        title: e.title,
                        bodyElems,
                        footerElems,
                    }
                });
            case PanelType.Stack: {
                let children = elems.map((elem) => {
                    return ce("elem", { props: { elem } });
                });
                let horizontal = e.panel.stack && e.panel.stack.orientation == Orientation.Horizontal;
                return ce('div', {
                    attrs: {
                        class: "d-flex " + (horizontal ? "flex-row" : "flex-column") + " " + e.styles
                    }
                }, children);
            }
            case PanelType.Wrap: {
                let children = elems.map((elem) => {
                    return ce("elem", { props: { elem } });
                });
                return ce('div', {
                    attrs: {
                        class: e.styles
                    }
                }, children);
            }
            case PanelType.Flex: {
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
__decorate([
    Prop()
], Panel.prototype, "elem", void 0);
Panel = __decorate([
    Component
], Panel);
export default Panel;
//# sourceMappingURL=Panel.vue.js.map