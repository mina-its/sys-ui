<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" :type="type" :value="value" :placeholder="placeholder"
           :name="viewType != 1 ? meta.name : null" @input="update()" @keydown="keydown" :readonly="readonly">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property, Keys} from "../../../sys/src/types";

	const main = require("./main");

	@Component
	export default class PropText extends Vue {
		@Prop() private type: string;
		@Prop() private doc: any;
		@Prop() private viewType: string;
		@Prop() private meta: Property;

		keydown(e) {
			if (e.which === Keys.up || e.which === Keys.down) {
				e.preventDefault();
			}
			this.$emit('keydown', e);
		}

		update() {
			let val = this.type == "number" ? (event.target as any).valueAsNumber : (event.target as any).value;
			if (val === "") val = null;
			main.setPropTextValue(this.meta, this.doc, val);
			this.$emit("changed", this.meta, this.value);
		}

		get readonly() {
			return this.meta.formula;
		}

		get value() {
			return main.getPropTextValue(this.meta, this.doc);
		}

		get placeholder() {
			if (!this.doc || this.meta.formula)
				return null;

			let val = this.doc[this.meta.name];
			if (_.isObject(val)) {
				let locale = main.getQs('e') || "en";
				if (!val[locale])
					return val["en"] || val[Object.Keys(val)[0]];
			}
			return null;
		}

	}
</script>

<style scoped lang="scss">

</style>
