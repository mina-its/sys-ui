<template>

</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class Function extends Vue {
		@Prop() private title: string;
		@Prop() private name: string;
		@Prop() private styles: string;
		private showProgress = false;
		private spinnerTimer = null;

		render(ce) {
			if (this.styles && this.styles.indexOf('fa-') > -1)
				return ce('div', [
					ce('button', {
						attrs: {"class": "btn"},
						on: {click: this.click},
					}, [
						ce('i', {attrs: {"class": "fa " + this.styles}})
					])
				]);
			else
				return ce('div', {attrs: {"class": "d-inline-block"}}, [
					ce('button', {
						attrs: {"class": 'btn ' + (this.styles || 'btn-primary m-1')},
						on: {click: this.click},
					}, [
						ce('span', this.title),
						ce('i', {attrs: {"class": `ml-2 fa fa-sync fa-spin wait-spinner ${(this.showProgress ? "" : "d-none")}`}})
					])
				]);
		}

		validate(data) {
			let meta: FunctionMeta = st.meta[this.name];
			if (meta && meta.properties) {
				let requiredProps = meta.properties.filter(p => p.required);
				let error = "";
				for (let prop of requiredProps) {
					if (data[prop.name] === null || data[prop.name] === "") {
						error = error || `value is required for property '${prop.title}'`;
						sys.setPropertyEmbeddedError(data, prop.name, `* mandatory`);
					}
				}
				if (error) {
					sys.notify(error, LogType.Error);
					return false;
				}
			}
			return true;
		}

		click(e) {
			this.showProgress = true;
			if (this.$listeners && this.$listeners.exec) {
				let cn: Context = {event: e, name: this.name, data: st.data};
				try {
					this.$emit('exec', cn, () => {
						this.showProgress = false;
					});
				} catch (ex) {
					this.showProgress = false;
					console.error(`function '${this.name}' click error.`, ex);
				}
			} else {
				let functionName = this.name;
				let meta: FunctionMeta = st.meta[functionName];
				let data = _.extend({_data: st.data}, st.data[functionName]);
				if (!this.validate(data))
					return;
				sys.log(`calling '${this.name}' ...`, data);
				sys.ajax("/" + this.name, data, null, (res) => {
					this.showProgress = false;
					if (meta.interactive && res.code == StatusCode.Accepted)
						return;
					else if (res.code != StatusCode.Ok)
						sys.notify(res.message, LogType.Error);
					else {
						$(".my-modal").modal('hide');
						setTimeout(() => {
							main.handleResponse(res);
						}, 100);
						//_.extend(st.data, res.data);
					}
				}, (err) => {
					this.showProgress = false;
					sys.notify(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
