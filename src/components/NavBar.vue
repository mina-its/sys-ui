<template>
    <nav :class="{'navbar navbar-expand-lg navbar-dark':true, 'container':containerStyle}">
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

    @Component({name: 'NavBar', components: {}})
    export default class NavBar extends Vue {
        @Prop() private containerStyle: boolean;

        get currentRef() {
            return location.hostname;
        }

    }
</script>

<style lang="scss">
    .navbar-nav {
        margin-right: auto !important;
    }
</style>
