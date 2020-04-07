"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const Markdown_vue_1 = tslib_1.__importDefault(require("@/components/Markdown.vue"));
const main = tslib_1.__importStar(require("@/main"));
const types_2 = require("@/types");
let FormElem = class FormElem extends vue_property_decorator_1.Vue {
    render(ce) {
        switch (this.elem.type) {
            case types_1.ElemType.Object:
                return ce('object-view', { props: { "elem": this.elem } });
            case types_1.ElemType.Function: {
                console.assert(this.elem.func.ref, `ref is expected for the function:`, this.elem.func);
                let ref = this.elem.func.ref;
                let data = this.$store.state.data[ref];
                let dec = main.getDec(data);
                if (!dec)
                    throw `meta  not found for func ref '${ref}'`;
                let exec = this.elem.func.exec;
                if (!exec && dec.clientSide) {
                    console.error("todo");
                    //exec = eval(`${dec.pack}.${dec.name}`);
                    //console.assert(exec, `client side function ${dec.name} in package ${dec.pack} not found!`);
                }
                return ce('function', {
                    props: { title: dec.title, name: dec.name, data, styles: this.elem.styles, exec }
                });
            }
            case types_1.ElemType.Property: {
                let uri = this.elem.property.entityRef;
                let item = this.$store.state.data[uri];
                let vue = this;
                let dec = main.getDec(item);
                if (!dec)
                    throw `property elem: meta not found for ref '${this.elem.property.entityRef}'`;
                let prop = dec.properties.find(prop => prop.name == this.elem.property.name);
                if (!prop)
                    throw `error rendering property elem. property '${this.elem.property.name}' dec not found!`;
                let propElem = ce('prop', {
                    props: {
                        item,
                        prop,
                        viewType: this.elem.property.detailsView ? types_1.ObjectViewType.DetailsView : types_1.ObjectViewType.GridView
                    },
                    on: {
                        changed(e) {
                            main.commitStoreChange(vue.$store, {
                                type: types_2.ChangeType.EditProp,
                                prop: e.prop,
                                value: e.val,
                                item,
                                uri,
                                vue: e.vue,
                            });
                        }
                    }
                });
                return propElem;
            }
            case types_1.ElemType.Text:
                console.assert(this.elem.text, 'incomplete text elem: ', this.elem);
                if (this.elem.text.markdown)
                    return ce('markdown', { props: { "content": this.elem.text.content, "styles": this.elem.styles } });
                else
                    return ce('span', { attrs: { "class": this.elem.styles } }, this.elem.text.content);
            case types_1.ElemType.Document:
                return ce('document-editor', {
                    props: { "value": this.elem.document.value },
                    attrs: { "class": this.elem.styles }
                });
            case types_1.ElemType.Image:
                return ce('img', { attrs: { "class": this.elem.styles, "src": this.elem.image.ref } });
            case types_1.ElemType.Panel:
                return ce('panel', { props: { "elem": this.elem } });
            case types_1.ElemType.Component:
                let data, props = this.elem.component.props;
                if (this.elem.component._ref)
                    data = this.$store.state.data[this.elem.component._ref];
                return ce(this.elem.component.name, { props: { data, ...props } });
            case types_1.ElemType.Chart:
                return ce('chart', { props: { data: this.$store.state.data['tests'] } });
        }
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], FormElem.prototype, "elem", void 0);
FormElem = tslib_1.__decorate([
    vue_property_decorator_1.Component({
        components: {
            Markdown: Markdown_vue_1.default
        }
    })
], FormElem);
exports.default = FormElem;
//# sourceMappingURL=FormElem.vue.js.map