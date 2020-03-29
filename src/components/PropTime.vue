<template>
    <input @focus="$emit('focus', $event)" type="text" :value="value" :name="viewType != 1 ? meta.name : null"
           @blur="update" class="form-control">
</template>

<script lang="ts">
	declare let moment: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property, LogType} from "../../../sys/src/types";

	const main = require("@/main");

	@Component
	export default class PropTime extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;
		@Prop() private viewType: string;

		update() {
			let val = new Date((event.target as any).value);
			if (val.getTime()) {
				this.doc[this.meta.name] = val;
			} else {
				main.notify('invalid-date', LogType.Error);
				this.doc[this.meta.name] = null;
			}
			this.$emit("changed", this.meta, this.value);
		}

		get value() {
			let val = this.doc[this.meta.name];
			return val ? moment(val).format("YYYY/MM/DD") : "";
		}
	}
</script>

<style scoped lang="scss">

</style>
