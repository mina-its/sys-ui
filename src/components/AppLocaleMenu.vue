<template>
    <span v-if="glob.config.locale" class="app-locale-menu dropdown">
        <a class="nav-link dropdown-toggle py-0 px-4 text-light" href="#" id="navbarDropdownLocale"
           role="button"
           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                style="font-size: 16px"
                class="fal fa-globe text-white pr-1"></i>{{glob.config.localeTitle.toUpperCase()}}</a>
        <div class="dropdown-menu dropdown-menu-right">
            <a v-for="item in glob.config.appLocales" class="dropdown-item" @click="changeLocale(item)"
               href="#">{{item.title}}</a>
        </div>
    </span>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {setQs} from '@/main';
    import {Pair} from '../../../sys/src/types';

    @Component({name: 'AppLocaleMenu'})
    export default class AppLocaleMenu extends Vue {
        changeLocale(locale: Pair) {
            location.href = setQs('e', locale.ref, true);
        }
    }
</script>

<style lang="scss">
</style>
