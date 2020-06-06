<template>
    <div v-if="glob.config.appLocales && glob.config.appLocales.length>1" class="app-locale-menu mx-2" data-toggle="tooltip" title="Change Language">
        <div v-if="glob.config.locale" class="dropdown">
            <a class="nav-link py-0 px-0 text-light dropdown-toggle" href="#" id="navbarDropdownLocale" role="button"
               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i style="font-size: 16px" class="fal fa-globe text-white px-1"></i>{{glob.config.localeTitle.toUpperCase()}}
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownLocale">
                <a v-for="item in glob.config.appLocales" class="dropdown-item py-2 font-weight-bold text-center" @click="changeLocale(item)"
                   href="javascript:void(0);">{{item.title}}</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {setQs} from '@/main';
    import {Pair} from '../../../sys/src/types';

    @Component({name: 'AppLocaleMenu'})
    export default class AppLocaleMenu extends Vue {
        changeLocale(locale: Pair) {
            console.log(locale);
            location.href = setQs('e', locale.ref, true);
        }
    }
</script>

<style lang="scss">
    .app-locale-menu {
        .dropdown-menu {
            margin-top: 1.05rem;
        }

        .dropdown-item:not(:last-child) {
            border-bottom: 1px solid #e9ecef;
        }
    }
</style>
