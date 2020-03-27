<template>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Elem, ElemType, ObjectViewType, FunctionMeta} from "../../../sys/src/types";
	import {st} from "@/main";

	const main = require("./main");

	@Component
	export default class FormElem extends Vue {
		@Prop() private elem!: Elem;

		render(ce: (...args: any) => void) {
			switch (this.elem.type) {
				case ElemType.Object:
					return ce('object-view', {props: {"elem": this.elem}});

				case ElemType.Function: {
					if (!this.elem.func.ref) {
						console.error(`ref is expected for the function:`, this.elem.func);
						return;
					}
					let ref = this.elem.func.ref as any;
					let meta: FunctionMeta = st.meta[ref];
					if (!meta) {
						console.error(`meta not found for func ref '${ref}'`, "meta:", JSON.stringify(st.meta));
						return;
					}

					let data = st.data[meta.name];
					let exec = this.elem.func.exec;
					if (!exec && meta.clientSide) {
						exec = eval(`${meta.pack}.${meta.name}`);
						if (!exec) {
							console.error(`client side function ${meta.name} in package ${meta.pack} not found!`);
							return null;
						}
					}

					return ce('function', {
						props: {
							"title": meta.title,
							"name": meta.name,
							"styles": this.elem.styles,
							"exec": exec
						}
					});
				}

				case ElemType.Property: {
					let meta = st.meta[this.elem.property.entityRef];
					if (meta == null) {
						console.error(`property elem: meta not found for ref '${this.elem.property.entityRef}'`);
						return;
					}
					let item = st.data[meta.name];
					let pMeta = meta.properties.find(prop => prop.name == this.elem.property.name);
					if (pMeta == null) {
						console.error(`error rendering property elem. property '${this.elem.property.name}' meta not found! parent meta:`, meta);
						return null;
					}
					return ce('prop', {
						props: {
							viewType: this.elem.property.detailsView ? ObjectViewType.DetailsView : ObjectViewType.GridView,
							item: item,
							meta: pMeta
						}
					});
				}

				case ElemType.Text:
					if (!this.elem.text) {
						console.error('incomplete text elem: ', this.elem);
						return ce('span', {}, "...");
					}

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
					if (this.elem.component._ref)
						data = st.data[this.elem.component._ref];
					return ce(this.elem.component.name, {props: {data, ...props}});

				case ElemType.Chart:
					return ce('chart', {props: {data: st.data['tests']}});
			}
		}
	}

</script>

<style scoped lang="scss">

</style>
