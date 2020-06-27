<template>
    <nav :class="{'navbar navbar-expand-lg navbar-dark':true, 'container':containerStyle}">
        <button @click="toggleSideNav" class="btn p-0 pt-1 mr-3"><i class="fas fa-bars fa-lg text-white"></i></button>
        <a class="navbar-brand" href="/">
            <img v-if="glob.config.brandingLogo" alt="logo" class='branding-logo img-responsive' :src="glob.config.brandingLogo"/>
            <span class="app-title">{{glob.config.appTitle}}</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <NavbarMenu :menu="glob.config.menu" :currentRef="currentRef"/>
            <!--<master-search></master-search>-->
            <AppLocaleMenu/>
            <AppUserLoginMenu/>
            <!-- <AppChangeRegion/> -->
        </div>
    </nav>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    declare let $: any;

    @Component({name: 'NavBar', components: {}})
    export default class NavBar extends Vue {
        @Prop() private containerStyle: boolean;

        get currentRef() {
            return location.hostname;
        }

        toggleSideNav() {
            $(".side-nav").toggleClass("collapse");
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
