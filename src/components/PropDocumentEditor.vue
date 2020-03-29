<template>
<textarea :value="value" wrap="off" @blur="update" autocorrect="off" spellcheck="false" autocapitalize="off"
          @keydown="keydown"
          :class="'prop-document-editor col-md-8 border '+styles+(invalidData ? ' border-danger': '')">
     </textarea>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property, WebMethod} from "../../../sys/src/types";
	import {glob} from "@/main";
	import {Modify} from '@/types';

	const main = require("./main");

	@Component
	export default class PropDocumentEditor extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;
		@Prop() private styles: string;
		@Prop() private invalidData: any;

		$el: any;

		keydown(e) {
			this.$emit('keydown', e);
		}

		update(e) {
			try {
				let val = (e.target as any).value ? JSON.parse((e.target as any).value) : null;
				this.invalidData = false;
				this.doc[this.meta.name] = val;

				let ref = this.meta._.ref.replace(new RegExp(`/${this.meta.name}$`), "");
				let data = {};
				data[this.meta.name] = val;
				glob.modifies.push({type: WebMethod.patch, ref, data} as Modify);
				glob.modifies[ref][this.meta.name] = JSON.parse(JSON.stringify(val));

				this.$emit("changed", this.meta, val);
			} catch (ex) {
				//this.doc._error = `Property '${this.meta.title}' invalid data.`;
				this.invalidData = true;
				glob.dirty = true;
			}
		}

		get value() {
			if (this.invalidData) {
				return this.$el.value;
			} else {
				let val = this.doc[this.meta.name];
				return val ? JSON.stringify(val) : "";
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
