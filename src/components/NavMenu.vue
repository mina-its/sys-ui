<template>
    <div :class="{'nav-menu':1,'collapse':collapse}" v-if="glob.config.navmenu.length">
        <div @click="toggleSideNav" :class="{'btn w-100':1,'text-end':!collapse,'text-center':collapse}" style="padding: .8rem"><i
                :class="{'fal text-white':1,'fa-times':!collapse,'fa-bars':collapse}"></i></div>
        <ul class="list-unstyled">
            <li v-for="item of glob.config.navmenu" :title="item.title" class="nav-item">
                <a v-if="item.title=='-'" class="d-block m-3 separator border-bottom border-light"></a>
                <a v-else-if="!item.ref" class="nav-link font-weight-bold"><i :class="item._cs"></i>{{item.title}}</a>
                <a v-else :href="item.ref" @click="clickLink($event, item)" :class="{'text-nowrap px-2 nav-link':1,'has-child':item.items}">
                    <i :class="item._cs"></i>{{item.title}}
                </a>
                <ul class="list-unstyled">
                    <li v-for="subitem of item.items" class="mr-2 nav-item">
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
        private collapse = false;

        get glob() {
            return glob;
        }

        mounted() {
            // this.collapse = localStorage.getItem('sys-sidenav-collapse') == "1";
        }

        toggleSideNav() {
            this.collapse = !this.collapse;
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
        overflow-y: auto;
        background-color: var(--nav-menu-bg);
        min-width: 15rem;
        width: 15rem;
        transition: all .2s ease-in-out;

        .separator {
            transition: margin-right .2s ease-in-out, margin-left .2s ease-in-out;
        }

        &.collapse {
            min-width: 3rem;
            width: 3rem;
            text-align: center;

            .nav-link {
                padding-right: 0 !important;
                padding-left: 0 !important;

                i {
                    text-align: center;
                }
            }

            .separator {
                margin-left: 0 !important;
                margin-right: 0 !important;
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
            font-size: .8rem;
            align-items: center;
            transition: all .2s ease-in-out;

            i {
                text-align: end;
                width: 3rem;
                min-width: 3rem;
                margin-inline-end: .5rem;
                font-size: 1.2rem;
                transition: all .2s ease-in-out;
            }
        }
    }
</style>
