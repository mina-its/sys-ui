<template>
    <header class="app-header">
        <nav class="d-flex h-100 text-white align-items-center" :style="{'background-color':navColor || '#222'}">

            <!-- Nav Menu Toggle --><!-- If: 'not header menu' or 'not mobile mode' and 'has menu'  -->
            <a v-if="(!glob.config.headerMenu || glob.screen==1) && glob.config.menu.length" title="Toggle navigation menu" class="px-3 header-link align-items-center d-flex" @click="glob.showNavMenu=!glob.showNavMenu">
                <i class="fal fa-bars fa-lg"></i>
            </a>

            <!-- Brand -->
            <a class="brand d-flex align-items-center text-nowrap text-decoration-none text-white mx-2" :style="{paddingInlineStart: glob.config.headerMenu && glob.screen>1 ? '.5rem':'unset'}"
               :href="'/'+(glob.config.prefix || '')">
                <img v-if="glob.config.brandingLogo" alt="logo" class='branding-logo mr-2 img-responsive' :src="glob.config.brandingLogo"/>
                <span class="app-title">{{glob.config.appTitle}}</span>
            </a>

            <!-- Header Menu -->
            <ul v-if="glob.config.headerMenu && glob.screen>1" class="d-flex h-100 navbar-nav flex-row">
                <li v-for="item of glob.config.menu"
                    :class="{'nav-item header-link d-flex align-items-center': 1, 'active':currentRef===item.ref, 'dropdown':item.items}">
                    <a v-if="item.items && item.items.length" href="#" class="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">{{item.title}}</a>
                    <div v-if="item.items && item.items.length" class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <template v-for="subitem of item.items">
                            <div v-if="subitem.title==='-'" class="dropdown-divider"></div>
                            <a v-else class="dropdown-item header-link" @click="clickLink" :href="subitem.ref">{{subitem.title}}</a>
                        </template>
                    </div>
                    <a v-else class="nav-link px-2" @click="clickLink($event,item)" :href="item.ref">{{item.title}}</a>
                </li>
            </ul>

            <div class="mr-auto"></div>

            <!-- Language -->
            <AppLocaleMenu v-if="glob.config.headerMenu && glob.screen>1" class="mx-0 mx-lg-2"/>

            <!-- Login -->
            <AppUserLoginMenu class="header-link align-items-center d-flex"/>

            <!-- Apps Menu -->
            <div v-if="glob.config.apps.length>1" class="dropdown h-100 apps-menu">
                <a class="header-link px-3 d-flex align-items-center" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg viewBox="0 0 32 32" width="20" height="20" fill="white">
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
                <div :class="{'dropdown-menu bg-light mt-0':1, 'dropdown-menu-right':ltr}">
                    <div class="d-flex apps-list overflow-auto flex-wrap p-5 align-content-end">
                        <a target="_self" :href="getAppUrl(app)" class="small bg-white m-3 business-app cursor-pointer" v-for="app of glob.config.apps" style="width: 8rem">
                            <div class="text-center p-2">
                                <div class="app-icon p-3 text-white" :style="{'background-color':app.iconColor}"><i :class="app.iconStyle + ' fa-4x'"></i></div>
                                <label class="pt-2 font-weight-bold" style="color: #444;font-size: .7rem">{{app.title}}</label>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob, prepareServerUrl} from "../main";

    declare let $: any;

    @Component({name: 'AppHeader'})
    export default class AppHeader extends Vue {

        getAppUrl(app) {
            return prepareServerUrl(app.prefix);
        }

        get navColor() {
            let app = glob.config.apps.find(a => a.prefix == glob.config.prefix);
            if (app && app.navColor)
                return app.navColor;
            else
                return "";
        }

        clickLink(ev, item) {
            $("a.active").removeClass("active");
            $(`a[href='${item.ref}']`).addClass("active");
        }

        get currentRef() {
            return location.hostname;
        }
    }
</script>

<style lang="scss">
    .app-header {
        height: 3rem;

        .app-title {
            font-size: 1.5rem;
            text-shadow: 0px 0px 10px #FFFB;
        }

        .header-link {
            height: 100%;
            padding: 0 .5rem;
            color: white;
            cursor: pointer;

            > a {
                color: white;
            }

            &:hover {
                text-decoration: none;
                background-color: #FFF3;
            }

        }

        .btn-toolbar {
            border-color: var(--layout-border);
        }

        .business-app {
            box-shadow: rgba(0, 0, 0, 0.1) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.1) 0px 4.8px 14.4px 0px;

            &:hover {
                box-shadow: rgba(0, 0, 0, 0.3) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.3) 0px 4.8px 14.4px 0px;
            }
        }

        .dropdown-toggle::after {
            vertical-align: 0.1em;
            margin-inline-start: 0.255em;
        }

        .apps-menu {
            .apps-list {
                width: 36rem
            }

            button a {
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
    }

    @media (max-width: 768px) {
        nav.navbar {
            .apps-menu {
                .apps-list {
                    width: 30rem;
                    padding: 1rem !important;
                }
            }
        }
    }

</style>
