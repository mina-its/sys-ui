<template>
    <article v-html="html" :class="'d-block border-0 '+ styles"></article>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class Markdown extends Vue {
		@Prop() private content: string;
		@Prop() private styles: string;

		get html() {
			return marked(this.content);
		}
	}
</script>

<style scoped lang="scss">

</style>
