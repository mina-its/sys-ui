<template>
<textarea :value="value" wrap="off" @blur="update" autocorrect="off" spellcheck="false" autocapitalize="off"
          @keydown="keydown"
          :class="'prop-document-editor col-md-8 border '+styles+(invalidData ? ' border-danger': '')">
     </textarea>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropDocumentEditor extends Vue {
		@Prop() private doc: any;
		@Prop() private meta: Property;
		@Prop() private styles: string;
		@Prop() private invalidData: any;

		keydown(e) {
			this.$emit('keydown', e);
		}

		update(e) {
			try {
				let val = (e.target as any).value ? JSON.parse((e.target as any).value) : null;
				this.invalidData = false;
				this.doc[prop(this).name] = val;

				let ref = prop(this)._.ref.replace(new RegExp(`/${prop(this).name}$`), "");
				let data = {};
				data[prop(this).name] = val;
				glob.md.push({type: WebMethod.patch, ref, data} as Modify);
				glob.od[ref][prop(this).name] = JSON.parse(JSON.stringify(val));

				this.$emit("changed", prop(this), val);
			} catch (ex) {
				//this.doc._error = `Property '${prop(this).title}' invalid data.`;
				this.invalidData = true;
				st.dirty = true;
			}
		}

		get value() {
			if (this.invalidData) {
				return this.$el.value;
			} else {
				let val = this.doc[prop(this).name];
				return val ? JSON.stringify(val) : "";
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
