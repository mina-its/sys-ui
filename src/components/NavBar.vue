<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="/">
            <img v-if="config.brandingLogo" alt="logo" class='branding-logo img-responsive'
                 :src="config.brandingLogo"/>
            <span class="app-title">{{config.appTitle}}</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li v-for="item of config.menu" :class="getStyle(item)">
                    <a v-if="item.items && item.items.length" href="#" class="nav-link dropdown-toggle"
                       id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">{{item.title}}</a>
                    <div v-if="item.items && item.items.length" class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a v-for="subitem of item.items" class="dropdown-item" :href="subitem.ref">{{subitem.title}}</a>
                    </div>
                    <a v-else class="nav-link" :href="item.ref">{{item.title}}</a>
                </li>
            </ul>

            <!--<master-search></master-search>-->
            <AppLocaleMenu></AppLocaleMenu>
            <a class="my-2 my-sm-0 text-light" :href="config.loginRef">{{config.loginTitle}}</a>
        </div>
    </nav>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import {AppStateConfig} from "@/types";
	import AppLocaleMenu from "@/components/AppLocaleMenu.vue";

	@Component({
		components: {AppLocaleMenu}
	})
	export default class NavBar extends Vue {
		getStyle(item) {
			let style = "nav-item";
			if (location.hostname == item.ref)
				style += " active";
			if (item.items)
				style += " dropdown";
			return style;
		}

		get config(): AppStateConfig {
			return this.$store.state.config;
		}
	}
</script>

<style lang="scss">
    .navbar-nav {
        margin-#{$right}: auto !important;
    }
</style>
