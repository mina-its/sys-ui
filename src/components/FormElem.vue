<script lang="ts">
    import {Component, Prop as ComProp, Vue} from 'vue-property-decorator';
    import {Elem, ElemType, ObjectViewType, FunctionDec} from "../../../sys/src/types";
    import * as main from '../main';
    import {ChangeType, ItemChangeEventArg, StateChange} from '@/types';

    @Component({name: 'FormElem', components: {}})
    export default class FormElem extends Vue {
        @ComProp() private elem: Elem;

        render(ce: (...args: any) => void) {
            if (!this.$store) {
                console.error('FormElem this.$store is empty, Maybe you need to call Vue.use(Vuex) before registering the components.');
                return null;
            }

            switch (this.elem.type) {
                case ElemType.Object:
                    return ce('object-view', {props: {"elem": this.elem}});

                case ElemType.Function: {
                    console.assert(this.elem.func.ref, `ref is expected for the function:`, this.elem.func);
                    let ref = this.elem.func.ref as string;
                    let data = this.$store.state.data[ref];
                    let dec = main.getDec(data) as FunctionDec;
                    if (!dec) throw `meta  not found for func ref '${ref}'`;

                    let exec = this.elem.func.exec;
                    if (!exec && dec.clientSide) {
                        console.error("todo");
                        //exec = eval(`${dec.pack}.${dec.name}`);
                        //console.assert(exec, `client side function ${dec.name} in package ${dec.pack} not found!`);
                    }

                    return ce('function', {
                        props: {title: dec.title, name: dec.name, data, styles: this.elem.styles, exec}
                    });
                }

                case ElemType.Property: {
                    let uri = this.elem.property.entityRef;
                    if (!this.$store.state.data) throw 'data is null!';
                    let item = this.$store.state.data[uri];
                    let vue = this;
                    let dec = main.getDec(item);
                    if (!dec) throw `property elem: meta not found for ref '${this.elem.property.entityRef}'`;

                    let prop = dec.properties.find(prop => prop.name == this.elem.property.name);
                    if (!prop) throw `error rendering property elem. property '${this.elem.property.name}' dec not found!`;

                    let propElem = ce('Property', {
                        props: {
                            item,
                            prop,
                            viewType: this.elem.property.detailsView ? ObjectViewType.DetailsView : ObjectViewType.GridView
                        },
                        on: {
                            changed(e: ItemChangeEventArg) {
                                main.commitStoreChange(vue.$store, {
                                    type: ChangeType.EditProp,
                                    prop: e.prop,
                                    value: e.val,
                                    item,
                                    uri,
                                    vue: e.vue,
                                } as StateChange);
                            }
                        }
                    });
                    return propElem;
                }

                case ElemType.Text:
                    console.assert(!!this.elem.text, 'incomplete text elem: ', this.elem);

                    if (this.elem.text.markdown)
                        return ce('markdown', {props: {"content": this.elem.text.content, "styles": this.elem.styles}});
                    else
                        return ce('span', {attrs: {"class": this.elem.styles}}, this.elem.text.content);

                case ElemType.Document:
                    return ce('document-editor', {
                        props: {"value": this.elem.document.value},
                        attrs: {"class": this.elem.styles}
                    });

                case ElemType.Image:
                    return ce('img', {attrs: {"class": this.elem.styles, "src": this.elem.image.ref}});

                case ElemType.Panel:
                    return ce('panel', {props: {"elem": this.elem}});

                case ElemType.Component:
                    let data, props = this.elem.component.props;
                    if (this.elem.component._)
                        data = this.elem.component._.data;
                    // if (this.elem.component._)
                    //     data = this.$store.state.data[this.elem.component._ref];
                    return ce(this.elem.component.name, {props: {data, ...props}});

                case ElemType.Chart:
                    return ce('AppChart', {props: {data: this.$store.state.data['tests']}});
            }
        }
    }

</script>
