<template>
    <ul class="nav flex-column tree">
        <li v-for="item in items" class="nav-item">
            <a @click="$emit('select', item)" class="text-nowrap text-secondary nav-link"
               :href="item.items ? 'javascript:;' : item.ref">{{item.title}}</a>
            <tree v-if="item.items" :items="item.items"></tree>
        </li>
    </ul>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';

	@Component({name:'Tree'})
	export default class Tree extends Vue {
		@Prop() private item: any[];
	}
</script>

<style scoped lang="scss">

</style>
