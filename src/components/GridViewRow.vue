<template>
    <tr :class="item._status?'selected':''" @click="click">
        <td v-if="selectable" class="text-center"><input type="checkbox" v-model="status" @change="updateStatus()"></td>
        <td v-else @click="headerClick(item, $event)" class="text-center"></td>
        <td v-for="(pMeta, index) in meta.properties">
            <prop @focus="focused($event)" :item="item" :meta="pMeta" @changed="changed" @keydown="keydown"
                  :viewType="1" :indexInGrid="index"></prop>
        </td>
    </tr>
</template>

<script lang="ts">
	declare let $: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {Property} from "../../../sys/src/types";
	import {RowStatus} from '@/types';

	@Component
	export default class GridViewRow extends Vue {
		@Prop() private item: any;
		@Prop() private selectable: boolean;
		@Prop() private meta: Property;

		focused(e, prop) {
			$(".prop-focused").removeClass("prop-focused");
			$(e.target).closest("td").addClass("prop-focused");
		}

		changed(meta, val) {
			this.$emit('changed', meta, val);
		}

		updateStatus() {
			this.item._status = (event.target as any).checked ? RowStatus.Selected : "";
		}

		headerClick(item, $event) {
			this.$emit('headerClick', item, $event);
		}

		click() {
			this.$emit('selected', this.item);
		}

		keydown(e, prop) {
			this.$emit('keydown', e, this.item, prop);
		}

		get status() {
			return this.item._status;
		}
	}
</script>

<style scoped lang="scss">

</style>
