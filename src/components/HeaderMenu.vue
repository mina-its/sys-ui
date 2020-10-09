<template>
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
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    declare let $: any;

    @Component({name: 'HeaderMenu'})
    export default class HeaderMenu extends Vue {
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
</style>