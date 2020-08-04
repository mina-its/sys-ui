<template>
    <nav :class="{'navbar navbar-expand-lg navbar-dark':true, 'container':containerStyle}" :style="{'background-color':navColor}">

        <!-- Apps Menu -->
        <div v-if="glob.config.apps.length" class="dropdown">
            <button class="btn btn-link" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
            </button>
            <div class="dropdown-menu mt-2">
                <div class="d-flex flex-wrap p-5" style="width: 50rem">
                    <a target="_self" :href="'/'+(app.prefix||'')" class="small m-3 business-app rounded border cursor-pointer" v-for="app of glob.config.apps" style="width: 8rem">
                        <div class="text-center p-2">
                            <div class="app-icon p-3 text-white" :style="{'background-color':app.iconColor}"><i :class="app.iconStyle + ' fa-4x'"></i></div>
                            <label class="pt-2 font-weight-bold text-black-50">{{app.title}}</label>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Brand -->
        <a class="navbar-brand" href="/">
            <img v-if="glob.config.brandingLogo" alt="logo" class='branding-logo img-responsive' :src="glob.config.brandingLogo"/>
            <span class="app-title">{{glob.config.appTitle}}</span>
        </a>

        <!-- Toggle Brand -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <NavbarMenu :menu="glob.config.menu" :currentRef="currentRef"/>

            <div class="mr-auto"></div>

            <!-- Feedback -->
            <AppFeedback class="mx-2"/>

            <!-- Language -->
            <AppLocaleMenu class="mx-2"/>

            <!-- Login -->
            <AppUserLoginMenu class="mx-2"/>

            <!-- <AppChangeRegion/> -->
        </div>
    </nav>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {glob} from "../main";

    @Component({name: 'NavBar', components: {}})
    export default class NavBar extends Vue {
        @Prop() private containerStyle: boolean;

        get navColor() {
            let app = glob.config.apps.find(a => a.prefix == glob.config.prefix);
            if (app)
                return app.navColor || "";
            else
                return "unset";
        }

        get currentRef() {
            return location.hostname;
        }


    }
</script>

<style lang="scss">
    nav.navbar {
        .business-app:hover {
            border: none !important;
            box-shadow: rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px;
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
    }

</style>
