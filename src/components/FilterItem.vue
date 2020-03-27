<template>
<span class="filter-item py-2 badge badge-pill badge-info">{{item.title}}
   <i @click="close" class="fas fa-times ml-2"></i>
 </span>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class FilterItem extends Vue {
		@Prop() private item: any;
		@Prop() private meta: Property;

		close() {
			this.meta.filter.items = _.filter(this.meta.filter.items, (item) => {
				return item.id !== this.item.id;
			});
		}
	}
</script>

<style scoped lang="scss">

</style>
