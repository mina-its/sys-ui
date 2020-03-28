<template>
    <span v-if="config.locale" class="dropdown">
        <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownLocale" role="button"
           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{config.locale.toUpperCase()}}</a>
        <div class="dropdown-menu">
            <a v-for="item in config.appLocales" class="dropdown-item" @click="main.changeLocale(item.ref)" href="#">{{item.title}}</a>
        </div>
    </span>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import {AppStateConfig} from "@/types";

	@Component
	export default class AppLocaleMenu extends Vue {
		get config(): AppStateConfig {
			return this.$store.state.config;
		}
	}
</script>

<style scoped lang="scss">

</style>
