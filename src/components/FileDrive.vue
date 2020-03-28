<template>
    <panel class="file-drive">
        <div>
            <FileDriveItem :file="item" v-for="item in files"></FileDriveItem>
        </div>
    </panel>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import FileDriveItem from "@/components/FileDriveItem.vue";

	@Component({components: {FileDriveItem}})
	export default class FileDrive extends Vue {
		@Prop() private path: string;
		@Prop() private files: any[];
	}
</script>
