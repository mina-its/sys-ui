<template>
<span v-if="value" class="tree-view-attribute m-2">
        <prop :viewType="3" :item="attr.item" :meta="attr.prop"></prop>
    </span>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
    import * as main from '@/main';

	@Component
	export default class TreeViewAttribute extends Vue {
		@Prop() private attr: any;

		get alue() {
			let prop = this.attr.prop;
			let val = this.attr.item ? this.attr.item[prop.name] : null;
			if (prop.text && prop.text.multiLanguage) {
				val = main.getPropTextValue(prop, this.attr.item);
			}
			return val;
		}
	}
</script>

<style scoped lang="scss">

</style>
