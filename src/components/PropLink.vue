<template>
    <a @focus="$emit('focus', $event)" :href="ref" @keydown="keydown">{{value}}</a>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/src/types";

	const main = require("./main");

	@Component
	export default class PropLink extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;

		keydown(e) {
			this.$emit('keydown', e);
		}

		get value() {
			if (this.meta.formula)
				return main.evalExpression(this.doc, this.meta.formula);

			let val = this.doc[this.meta.name];
			if (typeof val == "object") {
				let locale = main.getQs('e') || "en";
				return val[locale];
			} else
				return val;
		}

		get ref() {
			if (!this.doc._id)
				return "/";
			return "/" + this.meta._.ref.replace(new RegExp(`\/${this.meta.name}$`), "") + "/" + main.getBsonId(this.doc);
		}
	}
</script>

<style scoped lang="scss">

</style>
