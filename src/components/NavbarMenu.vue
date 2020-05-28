<template>
    <ul class="navbar-nav">
        <li v-for="item of menu"
            :class="{'nav-item': true, 'active':currentRef===item.ref, 'dropdown':item.items}">
            <a v-if="item.items && item.items.length" href="#" class="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-expanded="false">{{item.title}}</a>
            <div v-if="item.items && item.items.length" class="dropdown-menu" aria-labelledby="navbarDropdown">
                <template v-for="subitem of item.items">
                    <div v-if="subitem.title==='-'" class="dropdown-divider"></div>
                    <a v-else class="dropdown-item" :href="subitem.ref">{{subitem.title}}</a>
                </template>
            </div>
            <a v-else class="nav-link" :href="item.ref">{{item.title}}</a>
        </li>
    </ul>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {MenuItem} from "@/types";

    @Component({name: 'NavbarMenu'})
    export default class NavbarMenu extends Vue {
        @Prop() private menu: MenuItem[];
        @Prop() private currentRef: string;
    }
</script>
