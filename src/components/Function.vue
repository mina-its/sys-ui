<template>

</template>

<script lang="ts">
	declare let $: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {FunctionDeclare, LogType, Context, StatusCode, ItemMeta} from "../../../sys/src/types";
	import {glob} from '@/main';

	const main = require("./main");

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
			let dec = (data._ as ItemMeta).dec as FunctionDeclare;
			if (dec && dec.properties) {
				let requiredProps = dec.properties.filter(p => p.required);
				let error = "";
				for (const prop of requiredProps) {
					if (data[prop.name] === null || data[prop.name] === "") {
						error = error || `value is required for property '${prop.title}'`;
						main.setPropertyEmbeddedError(data, prop.name, `* mandatory`);
					}
				}
				if (error) {
					main.notify(error, LogType.Error);
					return false;
				}
			}
			return true;
		}

		click(e) {
			this.showProgress = true;
			if (this.$listeners && this.$listeners.exec) {
				let cn: Context = {event: e, name: this.name, data: glob.data} as Context;
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
				let data = {_data: glob.data, ...glob.data[functionName]};
				let dec = (data._ as ItemMeta).dec as FunctionDeclare;
				if (!this.validate(data))
					return;
				main.log(`calling '${this.name}' ...`, data);
				main.ajax("/" + this.name, data, null, (res) => {
					this.showProgress = false;
					if (dec.interactive && res.code == StatusCode.Accepted)
						return;
					else if (res.code != StatusCode.Ok)
						main.notify(res.message, LogType.Error);
					else {
						$(".my-modal").modal('hide');
						setTimeout(() => {
							main.handleResponse(res);
						}, 100);
						//_.extend(glob.data, res.data);
					}
				}, (err) => {
					this.showProgress = false;
					main.notify(err);
				});
			}
		}
	}
</script>

<style scoped lang="scss">

</style>
