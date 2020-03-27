<template>

</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Elem, LogType, ObjectViewType} from "../../../sys/src/types";
	import {st} from '@/main';

	const main = require("./main");

	@Component
	export default class ObjectView extends Vue {
		@Prop() private elem!: Elem;
		@Prop() private root!: boolean;

		render(ce) {
			let e = this.elem as Elem;
			//console.log("object-view:" + e.obj.ref);
			if (!e.obj) {
				main.notify("Element 'object-view' needs obj property.", LogType.Error);
				return;
			}

			let data = st.data[e.obj.ref];
			st.toolbar = true;
			let rt = this.root == null ? true : this.root;
			if (e.obj && e.obj.type == ObjectViewType.TreeView)
				return ce('tree-view', {props: {uri: e.obj.ref}});
			else
				return Array.isArray(data) ?
					ce('grid-view', {props: {uri: e.obj.ref, root: rt}}) :
					ce('details-view', {props: {uri: e.obj.ref, root: rt}});
		}
	}
</script>

<style scoped lang="scss">

</style>
