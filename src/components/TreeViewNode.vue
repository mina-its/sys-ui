<template>
    <div class="tree-view-node">
        <tree-view-line :line="node.line"></tree-view-line>
        <tree-view-node class="ml-4" v-if="node.nodes" v-for="child in node.nodes" :node="child"></tree-view-node>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component
	export default class TreeViewNode extends Vue {
		@Prop() private node: any;
	}
</script>

<style scoped lang="scss">

</style>
