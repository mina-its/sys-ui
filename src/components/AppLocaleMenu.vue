<template>
    <span v-if="glob.config.locale" class="app-locale-menu dropdown">
        <a class="nav-link dropdown-toggle py-0 px-4 text-light" href="#" id="navbarDropdownLocale" role="button"
           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{glob.config.locale.toUpperCase()}}</a>
        <div class="dropdown-menu">
            <a v-for="item in glob.config.appLocales" class="dropdown-item" @click="changeLocale(item.uri)"
               href="#">{{item.title}}</a>
        </div>
    </span>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {setQs} from '@/main';

    @Component
    export default class AppLocaleMenu extends Vue {
        changeLocale(locale: string) {
            location.href = setQs('e', locale, true);
        }
    }
</script>

<style scoped lang="scss">

</style>
