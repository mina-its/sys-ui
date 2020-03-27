<template>
    <input @focus="$emit('focus', $event)" ref="ctrl" v-bind:type="type" @keydown="keydown" :value="value"
           @blur="refreshText" @input="update()" @click="update" class="form-control">
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

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
			let items = val == "" ? prop(this)._.items : _.filter(prop(this)._.items, (item: Pair) => {
				return item.title.toLowerCase().indexOf(val.toLowerCase()) > -1;
			});
			items.forEach((item) => {
				item.hover = false;
			});
			this.showDropDown(items);
		}

		refreshText() {
			let val = this.doc[prop(this).name];
			this.doc[prop(this).name] = null;
			this.doc[prop(this).name] = val;
		}

		showDropDown(items) {
			if (!prop(this).required && items && items.length)
				items = [{ref: null, title: "", hover: false}].concat(items);

			main.showCmenu(prop(this), items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => {
				if (item == null) { // Esc
					this.refreshText();
					return;
				}
				this.doc[prop(this).name] = null;
				this.doc[prop(this).name] = item.ref;
				this.$emit("changed", prop(this), this.value);
			});
		}

		get value() {
			return main.getPropReferenceValue(prop(this), this.doc);
		}
	}
</script>

<style scoped lang="scss">

</style>
