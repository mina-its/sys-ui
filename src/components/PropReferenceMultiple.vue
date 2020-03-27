<template>
    <div ref="ctrl" :class="styles + ' prop-reference ref-multi'">
        <div v-for="item in items" class="rounded-lg rmI d-inline-block mr-1 my-1 px-1 border text-nowrap">
            <i @click="remove(item)" class="text-black-50 rmD fa fa-times" style="cursor:pointer"></i>
            <span class="rmV">{{item.title}}</span>
        </div>
        <textarea @click="showDropDown(meta._items)" style="width:50px;outline: none;resize:none;overflow:hidden;"
                  @blur="refreshText" @input="update()" class="bg-transparent align-middle rmT d-inline border-0"
                  rows="1" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"
                  tabindex="1"></textarea>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropReferenceMultiple extends Vue {
		@Prop() private type: string;
		@Prop() private doc: any;
		@Prop() private meta: Property;
		@Prop() private styles: string;

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

		remove(item) {
			let val = this.doc[prop(this).name];
			this.doc[prop(this).name] = _.filter(val, (v) => {
				return JSON.stringify(v) != JSON.stringify(item.ref);
			});
			this.$emit("changed", prop(this), val);
		}

		showDropDown(items) {
			let valueStrKeys = this.value.map((v) => {
				return JSON.stringify(v);
			});
			items = _.filter(items, (item) => {
				return !valueStrKeys.includes(JSON.stringify(item.ref));
			});
			main.showCmenu(prop(this), items, {ctrl: this.$refs.ctrl}, (state, item: MenuItem) => {
				if (item == null) { // Esc
					this.refreshText();
					return;
				}
				let val = this.doc[prop(this).name];
				if (!val)
					this.doc[prop(this).name] = val = [];
				val.push(item.ref);
				this.$emit("changed", prop(this), val);
			});
		}

		get value() {
			let val = this.doc[prop(this).name];
			if (!val)
				this.doc[prop(this).name] = val = [];
			else if (!Array.isArray(val))
				val = [val];
			return val;
		}

		get items() {
			let items: Pair[] = [];
			for (let v of this.value) {
				let item = _.find(prop(this)._.items, {ref: v}) as Pair;
				if (item)
					items.push(item);
				else
					items.push({title: "...", ref: v});
			}
			return items;
		}
	}
</script>

<style scoped lang="scss">

</style>
