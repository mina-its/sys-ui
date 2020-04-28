<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ElemType, Elem, PanelType, Orientation} from "../../../sys/src/types";
    import {glob} from '@/main';

    @Component({name:'Panel', components: {}})
    export default class Panel extends Vue {
        @Prop() private elem: Elem;

        render(ce) {
            let panel = this.elem.panel;
            let elems = panel.elems || [];

            switch (panel.type) {
                case PanelType.Modal:
                    let bodyElems = elems.filter(el => el.type !== ElemType.Function);
                    let footerElems = elems.filter(el => el.type === ElemType.Function);
                    glob.modal = true;
                    return ce('modal', {
                        props: {
                            title: this.elem.title,
                            bodyElems,
                            footerElems,
                            // todo: message: e.panel.modal.message
                        }
                    });

                case PanelType.Stack: {
                    let children = elems.map((elem) => {
                        return ce("form-elem", {props: {elem}});
                    });
                    let horizontal = panel.stack && panel.stack.orientation == Orientation.Horizontal;
                    return ce('div', {
                        attrs: {
                            class: "d-flex " + (horizontal ? "flex-row" : "flex-column") + " " + this.elem.styles
                        }
                    }, children);
                }

                case PanelType.Wrap: {
                    let children = elems.map((elem) => {
                        return ce("form-elem", {props: {elem}});
                    });
                    return ce('div', {
                        attrs: {
                            class: this.elem.styles
                        }
                    }, children);
                }

                case PanelType.Flex: {
                    let children = elems.map((elem) => {
                        return ce("form-elem", {props: {elem}});
                    });
                    return ce('div', {
                        attrs: {
                            class: "d-flex " + this.elem.styles
                        }
                    }, children);
                }
            }
            return ce('div');
        }
    }
</script>
