<template>
    <span v-if="glob.config.locale" class="dropdown">
        <a class="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownLocale" role="button"
           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{glob.config.locale.toUpperCase()}}</a>
        <div class="dropdown-menu">
            <a v-for="item in glob.config.appLocales" class="dropdown-item" @click="changeLocale(item.uri)"
               href="#">{{item.title}}</a>
        </div>
    </span>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {setQs} from "@/main";
    import * as main from '@/main';

    @Component
    export default class AppLocaleMenu extends Vue {
        changeLocale(locale: string) {
            location.href = setQs('e', locale, true);
        }
    }
</script>

<style scoped lang="scss">

</style>
