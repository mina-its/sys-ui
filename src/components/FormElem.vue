<template>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Elem, ElemType, ObjectViewType, FunctionDeclare, ItemMeta} from "../../../sys/src/types";
	import {glob} from "@/main";

	const main = require("./main");

	@Component
	export default class FormElem extends Vue {
		@Prop() private elem!: Elem;

		render(ce: (...args: any) => void) {
			switch (this.elem.type) {
				case ElemType.Object:
					return ce('object-view', {props: {"elem": this.elem}});

				case ElemType.Function: {
					console.assert(this.elem.func.ref, `ref is expected for the function:`, this.elem.func);
					let ref = this.elem.func.ref as any;
					let data = glob.data[ref];
					let dec = (data._ as ItemMeta).dec as FunctionDeclare;
					console.assert(dec, `meta not found for func ref '${ref}'`);

					let exec = this.elem.func.exec;
					if (!exec && dec.clientSide) {
						exec = eval(`${dec.pack}.${dec.name}`);
						console.assert(exec, `client side function ${dec.name} in package ${dec.pack} not found!`);
					}

					return ce('function', {
						props: {
							"title": dec.title,
							"name": dec.name,
							"styles": this.elem.styles,
							"exec": exec
						}
					});
				}

				case ElemType.Property: {
					let item = glob.data[this.elem.property.entityRef];
					let dec = (item._ as ItemMeta).dec;
					console.assert(dec, `property elem: meta not found for ref '${this.elem.property.entityRef}'`);
					let pMeta = dec.properties.find(prop => prop.name == this.elem.property.name);
					console.assert(pMeta, `error rendering property elem. property '${this.elem.property.name}' meta not found! parent meta:`);
					return ce('prop', {
						props: {
							viewType: this.elem.property.detailsView ? ObjectViewType.DetailsView : ObjectViewType.GridView,
							item: item,
							meta: pMeta
						}
					});
				}

				case ElemType.Text:
					console.assert(this.elem.text, 'incomplete text elem: ', this.elem);

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
						data = glob.data[this.elem.component._ref];
					return ce(this.elem.component.name, {props: {data, ...props}});

				case ElemType.Chart:
					return ce('chart', {props: {data: glob.data['tests']}});
			}
		}
	}

</script>

<style scoped lang="scss">

</style>
