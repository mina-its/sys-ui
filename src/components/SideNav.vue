<template>
    <div class="side-nav sidenav d-none d-lg-block" v-if="glob.config.navmenu.length">
        <!-- Search  -->
        <!--        <div class="input-group p-3 w-100">-->
        <!--            <input type="text" class="form-control border-right-0" placeholder="Search">-->
        <!--            <span class="input-group-append bg-white rounded border-left-0">-->
        <!--     	        <span class="input-group-text bg-transparent">-->
        <!--                    <span class="fal fa-search text-muted"></span>-->
        <!--		        </span>-->
        <!--            </span>-->
        <!--        </div>-->
        <ul class="px-0 list-unstyled mt-3">
            <li v-for="item of glob.config.navmenu" :class="{'nav-item':1, 'mr-2':ltr, 'ml-2':rtl}">
                <a v-if="item.title=='-'" class="d-block my-2 border-bottom border-secondary"></a>
                <a v-else-if="!item.ref" class="nav-link font-weight-bold"><i :class="item._cs"></i>{{item.title}}</a>
                <a v-else :href="item.ref" :class="getStyle(item)"><i :class="item._cs"></i>{{item.title}}</a>
                <ul class="list-unstyled">
                    <li v-for="subitem of item.items" class="mr-2 nav-item"><a :href="subitem.ref"
                                                                               :class="getStyle(subitem)">{{subitem.title}}</a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';

    @Component({name: 'SideNav'})
    export default class SideNav extends Vue {
        get glob() {
            return glob;
        }

        getStyle(item) {
            let style = "text-nowrap nav-link";
            if (location.hostname == item.ref)
                style += " active";
            if (item.items)
                style += " has-child";
            return style;
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
        transition: all  .3s ease-in-out;

        &.collapse {
            min-width: 0;
            width: 0;
        }

        a {
            color: var(--side-nav-color);
            border-left: 4px solid transparent;

            &:hover {
                color: var(--side-nav-color);
                background-color: #222;
                border-left-color: var(--link-color);
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
