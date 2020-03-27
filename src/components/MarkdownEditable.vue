<template>
    <article contenteditable="true" @input="updateHTML" :class="'d-block border-0 '+ styles"></article>
</template>

<script lang="ts">
	declare let marked: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component
	export default class MarkdownEditable extends Vue {
		@Prop() private content: string;
		@Prop() private styles: string;

		mounted() {
			this.$el.innerHTML = marked(this.content);
		}

		updateHTML(e) {
			this.$emit('input', e.target.innerHTML);
		}
	}
</script>

<style scoped lang="scss">

</style>
