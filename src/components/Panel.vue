<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ElemType, Elem, PanelType, Orientation} from "../../../sys/src/types";

	@Component
	export default class Panel extends Vue {
		@Prop() private elem: any;

		render(ce) {
			let e = this.elem as Elem;
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
							// todo: message: e.panel.modal.message
						}
					});

				case PanelType.Stack: {
					let children = elems.map((elem) => {
						return ce("elem", {props: {elem}});
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
						return ce("elem", {props: {elem}});
					});
					return ce('div', {
						attrs: {
							class: e.styles
						}
					}, children);
				}

				case PanelType.Flex: {
					let children = elems.map((elem) => {
						return ce("elem", {props: {elem}});
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
	}
</script>

<style scoped lang="scss">

</style>
