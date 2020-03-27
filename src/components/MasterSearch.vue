<template>
    <form class="form-inline my-2 my-lg-0">
        <input id='master-search' class="form-control mr-sm-2" type="search" placeholder="${$t('search')}" aria-label="Search">
    </form>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class MasterSearch extends Vue {
		@Prop() private prop!: string;
	}
</script>

<style scoped lang="scss">

</style>
