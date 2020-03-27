<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" v-bind:type="type" @keydown="keydown" :value="value"
           @blur="refreshText" @input="update()" @click="update" class="form-control">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property, Keys} from "../../../sys/src/types";
	import {st} from "@/main";
		import { MenuItem } from '@/types';

	const main = require("./main");

	@Component
	export default class PropReference extends Vue {
		@Prop() private type: string;
		@Prop() private doc: any;
		@Prop() private meta: Property;

		keydown(e) {
			if (e.which === Keys.up || e.which === Keys.down) {
				e.preventDefault();
			}
			if (!st.cmenu.show)
				this.$emit('keydown', e);
		}

		update() {
			let val = (event.target as any).value;
			let items = val == "" ? this.meta._.items : this.meta._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
			items.forEach((item) => {
				item.hover = false;
			});
			this.showDropDown(items);
		}

		refreshText() {
			let val = this.doc[this.meta.name];
			this.doc[this.meta.name] = null;
			this.doc[this.meta.name] = val;
		}

		showDropDown(items) {
			if (!this.meta.required && items && items.length)
				items = [{ref: null, title: "", hover: false}].concat(items);

			main.showCmenu(this.meta, items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => {
				if (item == null) { // Esc
					this.refreshText();
					return;
				}
				this.doc[this.meta.name] = null;
				this.doc[this.meta.name] = item.ref;
				this.$emit("changed", this.meta, this.value);
			});
		}

		get value() {
			return main.getPropReferenceValue(this.meta, this.doc);
		}
	}
</script>

<style scoped lang="scss">

</style>
