<template>
    <div class="app-user-login">
        <div v-if="!glob.config.user.authenticated">
            <a class="my-2 my-sm-0 btn btn-link text-white" target="_parent" href="/authCheck">
                <i class="fal fa-user mx-1"></i>
                <span v-if="glob.config.user.signinTitle">{{glob.config.user.signinTitle}}</span>
            </a>
        </div>
        <div v-else class="dropdown d-flex">
            <button class="avatar bg-transparent border-0 outline-0 dropdown-toggle" id="dropdownProfileBrief" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i v-if="buttonClass" :class="buttonClass"></i>
                <span v-else role="img" class="d-flex cursor-pointer bg-transparent w-100 h-100" :style="{'background-image':`url(${profilePhoto})`}"/>
            </button>
            <div :class="{'dropdown-menu text-center profile-brief':1,'dropdown-menu-right':ltr}" aria-labelledby="dropdownProfileBrief">
                <img class="m-4 mx-5" :src="profilePhoto"/>
                <h2>{{glob.config.user.title}}</h2>
                <div>{{glob.config.user.email}}</div>
                <a class="m-2 btn btn-outline-secondary profile-button" target="_blank" href="/my-account">{{$t('my-account')}}</a>
                <hr>
                <button class="m-2 btn btn-secondary" @click="signOut">{{$t('sign-out')}}</button>
                <hr>
                <a class="m-2 text-secondary small" href="/privacy-policy">Privacy Policy</a>
                -
                <a class="m-2 text-secondary small" href="/terms-of-service">Terms of Service</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {glob, prepareServerUrl} from "../main";

    declare let $: any;

    @Component({name: 'AppUserLoginMenu'})
    export default class AppUserLoginMenu extends Vue {
        @Prop() private buttonClass?: string;

        signOut() {
            console.log(location.href);
            location.href = `/signout?back=${encodeURI(location.href)}`;
        }

        get profilePhoto(): string {
            if (glob && glob.config && glob.config.user.photoUrl)
                return glob.config.user.photoUrl;
            else
                return 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5bed565…/5f7abfa5-a174-45b5-a5a5-68a91a876506/128';
        }

        mounted() {
            $('.app-user-login .dropdown').on('show.bs.dropdown', function () {
                $(this).find('.dropdown-menu').first().stop(true, true).slideDown(100);
            });

            // Add slideUp animation to Bootstrap dropdown when collapsing.
            $('.app-user-login .dropdown').on('hide.bs.dropdown', function () {
                $(this).find('.dropdown-menu').first().stop(true, true).slideUp(300);
            });
        }
    }
</script>

<style lang="scss">
    .app-user-login {
        .dropdown-menu {
            margin-top: .7rem;
        }

        .profile-brief {
            width: 20rem;
        }

        .profile-brief img {
            width: 8rem;
            height: 8rem;
            object-position: center;
            object-fit: cover;
            border-radius: 50%;
        }

        .profile-brief .box span {
            width: 100px;
            height: 100px;
        }

        .avatar {
            width: 38px;
            height: 28px;

            &::after {
                display: none;
            }
        }

        .avatar span {
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 50%;
            flex: 1 1 100%;
            border: 2px solid white;
        }

        .profile-button {
            width: 200px;
        }
    }
</style>
