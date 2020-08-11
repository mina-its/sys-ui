<template>
    <div :class="{'nav-menu d-flex align-items-start flex-column':1,'collapse-nav':!glob.showNavMenu}" v-if="!glob.config.headerMenu || glob.screen==1">
        <ul class="pt-4 mb-auto w-100">
            <li v-for="item of glob.config.menu" :title="item.title" class="nav-item text-uppercase">
                <div v-if="item.title=='-'" class="d-block separator"></div>
                <a v-else-if="!item.ref" class="nav-link font-weight-bold"><i :class="item._cs"></i>{{item.title}}</a>
                <a v-else :href="item.ref" @click="clickLink($event, item)" :class="{'text-nowrap nav-link':1,'has-child':item.items}">
                    <i :class="item._cs"></i>
                    <span>{{item.title}}</span>
                </a>
                <ul class="list-unstyled" style="padding-inline-start: 6rem">
                    <li v-for="subitem of item.items" class="nav-item px-3">
                        <a :href="subitem.ref" :class="{'text-nowrap nav-link':1}">{{subitem.title}}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';

    declare let $: any;

    @Component({name: 'NavMenu'})
    export default class NavMenu extends Vue {
        toggleSideNav() {
            glob.showNavMenu = false;
            // localStorage.setItem('sys-sidenav-collapse', this.collapse ? "1" : null);
        }

        clickLink(ev, item) {
            $("a.active").removeClass("active");
            $(`a[href='${item.ref}']`).addClass("active");
        }
    }
</script>

<style lang="scss">

    .nav-menu {
        overflow-x: hidden;
        overflow-y: auto;
        background-color: var(--nav-menu-bg);
        min-width: 17rem;
        width: 17rem;
        transition: all .2s ease-in-out;

        li {
            display: unset;
        }

        .separator {
            border-bottom: 1rem solid #7773;
        }

        &.collapse-nav {
            min-width: 3.2rem;
            width: 3.2rem;
            text-align: center;

            .nav-link {
                padding-right: 0 !important;
                padding-left: 0 !important;

                i {
                    text-align: center;
                }
            }
        }

        a {
            color: var(--nav-menu-color);

            &:hover {
                color: var(--nav-menu-color);
                background-color: #555;
            }

            &.active {
                color: var(--nav-menu-color);
                background-color: #222;
            }
        }

        .nav-link {
            display: flex;
            font-size: 1rem;
            padding: .5rem 0;
            align-items: center;
            transition: all .2s ease-in-out;

            i {
                text-align: center;
                width: 3.2rem;
                min-width: 3.2rem;
                margin-inline-end: .5rem;
                font-size: 1.2rem;
                transition: all .2s ease-in-out;
            }
        }
    }

    @media (max-width: 576px) {
        .nav-menu {
            min-width: 100%;
            width: 100%;

            &.collapse-nav {
                min-width: 0rem;
                width: 0;
            }
        }
    }
</style>
