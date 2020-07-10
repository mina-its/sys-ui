<template>
    <div :class="{'side-nav sidenav d-none d-lg-block':1,'collapse':collapse}" v-if="glob.config.navmenu.length">
        <div @click="toggleSideNav" class="btn" style="padding: .8rem"><i :class="{'fal fa-arrow-to-left text-white':1,'fa-arrow-to-right':collapse}"></i></div>
        <!-- Search  -->
        <!--        <div class="input-group p-3 w-100">-->
        <!--            <input type="text" class="form-control border-right-0" placeholder="Search">-->
        <!--            <span class="input-group-append bg-white rounded border-left-0">-->
        <!--     	        <span class="input-group-text bg-transparent">-->
        <!--                    <span class="fal fa-search text-muted"></span>-->
        <!--		        </span>-->
        <!--            </span>-->
        <!--        </div>-->
        <ul class="list-unstyled">
            <li v-for="item of glob.config.navmenu" class="nav-item">
                <a v-if="item.title=='-'" class="d-block border-bottom border-secondary"></a>
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

    @Component({name: 'SideNav'})
    export default class SideNav extends Vue {
        private collapse = false;

        get glob() {
            return glob;
        }

        toggleSideNav() {
            this.collapse = !this.collapse;
        }

        clickLink(ev, item) {
            $("a.active").removeClass("active");
            $(`a[href='${item.ref}']`).addClass("active");
        }
    }
</script>

<style lang="scss">

    $left: left;
    $right: right;

    .side-nav {
        overflow-y: scroll;
        -ms-overflow-style: none;
        background-color: var(--side-nav-bg);
        min-width: 280px;
        width: 280px;
        transition: all .2s ease-in-out;

        &.collapse {
            min-width: 2.6rem;
            width: 2.6rem;
        }

        a {
            color: var(--side-nav-color);
            border-left: 4px solid transparent;

            &:hover {
                color: var(--side-nav-color);
                background-color: #555;
            }

            &.active {
                color: var(--side-nav-color);
                background-color: #222;
            }
        }

        .nav-link {
            padding-#{$left}: 0.2rem;

            i {
                width: 30px;
            }
        }

        &::-webkit-scrollbar {
            display: none;
        }

    }

    .sidenav {
        position: sticky;
        overflow: hidden;
        top: 0;
    }
</style>
