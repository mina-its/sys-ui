<template>
    <span v-if="st.config.locale" class="dropdown">
        <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownLocale" role="button"
           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{st.config.locale.toUpperCase()}}</a>
        <div class="dropdown-menu">
            <a v-for="item in st.config.appLocales" class="dropdown-item" @click="main.changeLocale(item.ref)" href="#">{{item.title}}</a>
        </div>
    </span>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class AppLocaleMenu extends Vue {
		@Prop() private prop!: string;
	}
</script>

<style scoped lang="scss">

</style>
