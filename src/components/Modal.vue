<template>
    <div class="modal fade my-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{title}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <elem v-for="elem in bodyElems" :elem="elem"></elem>
                    </form>
                </div>
                <div v-if="glob.notify" class="text-light bg-danger modal-body">
                    <span>{{glob.notify.message}}</span>
                </div>
                <div class="modal-footer">
                    <elem v-for="elem in footerElems" :elem="elem"></elem>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	declare let $: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {st} from "@/main";

	const main = require("./main");

	@Component
	export default class Modal extends Vue {
		@Prop() private title: string;
		@Prop() private footerElems: any[];
		@Prop() private bodyElems: any[];

		created() {
			// console.log("footerElems:", this.footerElems);
			// console.log(this.bodyElems);
		}

		mounted() {
			glob.modal = true;
			$(".my-modal").modal().on('hidden.bs.modal', function () {
				glob.modal = false;
				main.load(location.href);
			});
		}
	}
</script>

<style scoped lang="scss">

</style>
