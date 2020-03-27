<template>
    <div class="row">
        <div>{{file.name}}</div>
        <div>{{file.size}}</div>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class FileDriveItem extends Vue {
		@Prop() private file: any;
	}
</script>

<style scoped lang="scss">

</style>
