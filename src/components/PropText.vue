<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" :type="type" :value="value" :placeholder="placeholder"
           :name="viewType != 1 ? meta.name : null" @input="update()" @keydown="keydown" :readonly="readonly">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

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
			main.setPropTextValue(prop(this), this.doc, val);
			this.$emit("changed", prop(this), this.value);
		}

		get readonly() {
			return prop(this).formula;
		}

		get value() {
			return main.getPropTextValue(prop(this), this.doc);
		}

		get placeholder() {
			if (!this.doc || prop(this).formula)
				return null;

			let val = this.doc[prop(this).name];
			if (_.isObject(val)) {
				let locale = main.getQs('e') || "en";
				if (!val[locale])
					return val["en"] || val[_.keys(val)[0]];
			}
			return null;
		}

	}
</script>

<style scoped lang="scss">

</style>
