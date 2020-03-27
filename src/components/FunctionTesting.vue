<template>

</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";
	import {FunctionMeta} from '../../../web/src/types';

	@Component
	export default class FunctionTesting extends Vue {
		@Prop() private meta: FunctionMeta;
		message = "";

		render(ce) {
			let sample = this.meta.test.samples[0];
			let bodyElems = [];
			if (this.meta.properties)
				for (let para of this.meta.properties) {
					bodyElems.push({
						type: ElemType.Property, property: {
							name: para.name,
							viewType: ObjectViewType.DetailsView,
							entityRef: this.meta.name,
						}
					});
				}

			let data = sample.input || {};
			// bodyElems.push({type: ElemType.Text, text: {content: "**Input Json:**", markdown: true}});
			// bodyElems.push({type: ElemType.Document, document: {value: data}});

			main.vueResetProperties(data, this.meta.name, false);
			st.data[this.meta.name] = data;
			st.data["functionTest"] = {functionId: this.meta._id, sampleIndex: 0, input: data};
			let footerElems = [{type: ElemType.Function, func: {ref: "functionTest", exec: this.functionTest}}];
			return ce('modal', {
				props: {
					title: this.meta.title,
					bodyElems,
					footerElems,
					// message: this.message
				}
			});
		}

		functionTest(x, y) {
			let data = st.data["functionTest"];
			this.message = "Running ...";
			main.ajax("/functionTest", data, null, (res) => {
				if (res.message)
					this.message = res.message;
				else
					this.message = "Done!";
			}, (err) => {
				main.notify(err);
			});
		}
	}
</script>

<style scoped lang="scss">

</style>
