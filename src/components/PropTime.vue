<template>
    <input @focus="$emit('focus', $event)" type="text" :value="value" :name="viewType != 1 ? meta.name : null"
           @blur="update" class="form-control">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropTime extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;
		@Prop() private viewType: string;

		update() {
			let val = new Date((event.target as any).value);
			if (val.getTime()) {
				this.doc[prop(this).name] = val;
			} else {
				sys.notify('invalid-date', LogType.Error);
				this.doc[prop(this).name] = null;
			}
			this.$emit("changed", prop(this), this.value);
		}

		get value() {
			let val = this.doc[prop(this).name];
			return val ? moment(val).format("YYYY/MM/DD") : "";
		}
	}
</script>

<style scoped lang="scss">

</style>
