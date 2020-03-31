<template>
    <div class="side-nav sidenav p-3 d-none d-lg-block">
        <div class="input-group mb-3">
            <input type="text" class="form-control border-right-0" placeholder="Search">
            <span class="input-group-append bg-white rounded border-left-0">
     	        <span class="input-group-text bg-transparent">
                    <span class="fa fa-search text-muted"></span>
		        </span>
            </span>
        </div>
        <ul class="pl-0 list-unstyled">
            <li v-for="item of glob.config.navmenu" class="mr-2 nav-item">
                <a v-if="item.title=='-'" class="d-block my-2 border-bottom border-secondary"></a>
                <a v-else-if="!item.ref" class="nav-link font-weight-bold">{{item.title}}</a>
                <a v-else :href="item.ref" :class="getStyle(item)">{{item.title}}</a>
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
    import {glob} from "@/main";

    @Component
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
    .side-nav {
        overflow-y: scroll;
        -ms-overflow-style: none;
        background-color: var(--side-nav-bg);
        min-width: 280px;

        a {
            color: var(--side-nav-color);

            &:hover {
                text-decoration: underline;
                color: var(--side-nav-color);
            }
        }

        &::-webkit-scrollbar {
            display: none;
        }

    }

    .sidenav {
        position: sticky;
        top: 0;
    }
</style>
