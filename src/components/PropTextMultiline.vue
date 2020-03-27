<template>
    <textarea @focus="$emit('focus', $event)" :value="value" @input="update()"
              class="text-nowrap form-control"></textarea>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropTextMultiline extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;

		update() {
			let val = (event.target as any).value;
			if (val === "") val = null;
			this.doc[prop(this).name] = val;
			this.$emit("changed", prop(this), this.value);
		}

		get value() {
			return this.doc[prop(this).name];
		}
	}
</script>

<style scoped lang="scss">

</style>
