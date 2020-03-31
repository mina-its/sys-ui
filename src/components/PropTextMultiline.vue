<template>
    <textarea @focus="$emit('focus', $event)" :value="value" @input="update()"
              class="text-nowrap form-control"></textarea>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/types";

	@Component
	export default class PropTextMultiline extends Vue {
		@Prop() private doc: any;
		@Prop() private prop: Property;

		update() {
			let val = (event.target as any).value;
			if (val === "") val = null;
			this.doc[this.prop.name] = val;
			this.$emit("changed", this.prop, this.value);
		}

		get value() {
			return this.doc[this.prop.name];
		}
	}
</script>

<style scoped lang="scss">

</style>
