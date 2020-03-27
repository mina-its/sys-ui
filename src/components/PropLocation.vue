<template>
    <div :class="'prop-location text-center ' + (value ? 'has-data': '')" @click="changing"><i
            class="fa fa-map-marker-alt"></i></div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/src/types";
	import {st} from "@/main";

	const main = require("./main");

	@Component
	export default class PropLocation extends Vue {
		@Prop() private meta: Property;
		@Prop() private doc: any;

		changed() {
			this.$emit("changed", this.meta, this.value);
		}

		changing() {
			let doc = this.doc;
			let changed = this.changed;
			st.geoMap = {
				show: true,
				val: this.value,
				select: function (value) {
					doc[this.meta.name] = value;
					console.log(doc);
					changed();
				}
			};
		}

		get value() {
			return this.doc[this.meta.name];
		}
	}
</script>

<style scoped lang="scss">

</style>
