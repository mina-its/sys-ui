<template>
    <input @focus="$emit('focus', $event)" type="checkbox" :id="meta.name" class="form-check-input" v-model="value"
           :name="meta.name" @keydown="keydown" @change="update">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/src/types";

	@Component
	export default class PropBoolean extends Vue {
		@Prop() private meta: Property;
		@Prop() private doc: any;

		keydown(e) {
			this.$emit('keydown', e);
		}

		update() {
			this.doc[this.meta.name] = (event.target as any).checked;
			this.$emit("changed", this.meta, this.value);
		}

		get value() {
			return this.doc[this.meta.name];
		}
	}
</script>

<style scoped lang="scss">

</style>
