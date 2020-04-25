<template>
    <nav :class="{'navbar navbar-expand-lg navbar-dark':true, 'container':containerStyle}">
        <a class="navbar-brand" href="/">
            <img v-if="glob.config.brandingLogo" alt="logo" class='branding-logo img-responsive'
                 :src="glob.config.brandingLogo"/>
            <span class="app-title">{{glob.config.appTitle}}</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li v-for="item of glob.config.menu"
                    :class="{'nav-item': true, 'active':currentRef===item.ref, 'dropdown':item.items}">
                    <a v-if="item.items && item.items.length" href="#" class="nav-link dropdown-toggle"
                       id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">{{item.title}}</a>
                    <div v-if="item.items && item.items.length" class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a v-for="subitem of item.items" class="dropdown-item" :href="subitem.ref">{{subitem.title}}</a>
                    </div>
                    <a v-else class="nav-link" :href="item.ref">{{item.title}}</a>
                </li>
            </ul>

            <!--<master-search></master-search>-->
            <AppLocaleMenu/>
            <AppUserLoginMenu/>

        </div>
    </nav>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import AppLocaleMenu from "@/components/AppLocaleMenu.vue";
    import AppUserLoginMenu from "@/components/AppUserLoginMenu.vue";

    @Component({name: 'NavBar', components: {AppLocaleMenu, AppUserLoginMenu}})
    export default class NavBar extends Vue {
        @Prop() private containerStyle: boolean;

        get currentRef() {
            return location.hostname;
        }
    }
</script>

<style lang="scss">
    $left: left;
    $right: right;

    .navbar-nav {
        margin-#{$right}: auto !important;
    }
</style>
