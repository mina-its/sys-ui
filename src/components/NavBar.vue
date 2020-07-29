<template>
    <nav :class="{'navbar navbar-expand-lg navbar-dark':true, 'container':containerStyle}">

        <!-- Apps Menu -->
        <a class="apps-menu py-1 mr-3" href="#">
            <svg viewBox="0 0 32 32">
                <rect height="6" width="6" x="1" y="1"/>
                <rect height="6" width="6" x="25" y="1"/>
                <rect height="6" width="6" x="13" y="1"/>
                <rect height="6" width="6" x="1" y="13"/>
                <rect height="6" width="6" x="1" y="25"/>
                <rect height="6" width="6" x="25" y="25"/>
                <rect height="6" width="6" x="25" y="13"/>
                <rect height="6" width="6" x="13" y="13"/>
                <rect height="6" width="6" x="13" y="25"/>
            </svg>
        </a>

        <a class="navbar-brand" href="/">
            <img v-if="glob.config.brandingLogo" alt="logo" class='branding-logo img-responsive' :src="glob.config.brandingLogo"/>
            <span class="app-title">{{glob.config.appTitle}}</span>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <NavbarMenu :menu="glob.config.menu" :currentRef="currentRef" />

            <!-- Feedback -->
            <AppFeedback class="mx-2" />

            <!-- Language -->
            <AppLocaleMenu class="mx-2" />

            <!-- Login -->
            <AppUserLoginMenu class="mx-2" />

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

    .apps-menu {
        width: 16px;

        rect {
            fill: none;
            stroke: white;
            stroke-linejoin: round;
            stroke-width: 2px;
        }

        &:hover {
            rect {
                stroke: gray;
            }
        }

    }

</style>
