<template>
    <a @focus="$emit('focus', $event)" :href="ref" @keydown="keydown">{{value}}</a>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropLink extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;

		keydown(e) {
			this.$emit('keydown', e);
		}

		get value() {
			if (prop(this).formula)
				return main.evalExpression(this.doc, prop(this).formula);

			let val = this.doc[prop(this).name];
			if (_.isObject(val)) {
				let locale = main.getQs('e') || "en";
				return val[locale];
			} else
				return val;
		}

		get ref() {
			if (!this.doc._id)
				return "/";
			return "/" + prop(this)._.ref.replace(new RegExp(`\/${prop(this).name}$`), "") + "/" + sys.getBsonId(this.doc);
		}
	}
</script>

<style scoped lang="scss">

</style>
