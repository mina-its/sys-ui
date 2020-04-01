<template>
    <div :class="'prop-location text-center ' + (value ? 'has-data': '')" @click="changing"><i
            class="fa fa-map-marker-alt"></i></div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/src/types";
	import {glob} from "@/main";

	const main = require("@/main");

	@Component
	export default class PropLocation extends Vue {
		@Prop() private prop: Property;
		@Prop() private doc: any;

		changed() {
			this.$emit("changed", this.prop, this.value);
		}

		changing() {
			let doc = this.doc;
			let changed = this.changed;
			glob.geoMap = {
				show: true,
				val: this.value,
				select: function (value) {
					doc[this.prop.name] = value;
					console.log(doc);
					changed();
				}
			};
		}

		get value() {
			return this.doc[this.prop.name];
		}
	}
</script>

<style scoped lang="scss">

</style>
