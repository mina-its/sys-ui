<template>
    <panel class="file-drive">
        <div>
            <file-drive-item :file="item" v-for="item in files"></file-drive-item>
        </div>
    </panel>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class FileDrive extends Vue {
		@Prop() private path: string;
		@Prop() private files: any[];
	}
</script>

<style scoped lang="scss">

</style>
