<template>
    <a class="main">
        <span role="img"></span>
        <!--        <a class="dropdown-toggle my-2 my-sm-0 text-light" :href="glob.config.loginRef">{{glob.config.loginTitle}}</a>-->
        <!--        {{glob.config.loginTitle}}-->
    </a>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';


    @Component
    export default class AppUserLoginMenu extends Vue {

    }
</script>

<style scoped lang="scss">
    .main {
        width: 28px;
        height: 28px;
        cursor: pointer;
    }

    .main span {
        background-color: transparent;
        background-image: url(https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5bed565…/5f7abfa5-a174-45b5-a5a5-68a91a876506/128);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 50%;
        display: flex;
        flex: 1 1 100%;
        height: 100%;
        width: 100%;
    }
</style>
