<template>
    <input @focus="$emit('focus', $event)" type="checkbox" :id="prop.name" class="form-check-input" v-model="value"
           :name="prop.name" @keydown="keydown" @change="update">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/types";

	@Component
	export default class PropBoolean extends Vue {
		@Prop() private prop: Property;
		@Prop() private doc: any;

		keydown(e) {
			this.$emit('keydown', e);
		}

		update() {
			this.doc[this.prop.name] = (event.target as any).checked;
			this.$emit("changed", this.prop, this.value);
		}

		get value() {
			return this.doc[this.prop.name];
		}
	}
</script>

<style scoped lang="scss">

</style>
