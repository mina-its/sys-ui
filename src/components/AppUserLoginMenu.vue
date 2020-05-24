<template>
    <div class="app-user-login">
        <div v-if="glob.config.user.loginUrl">
            <a class="dropdown-toggle my-2 my-sm-0 text-light" :href="glob.config.user.loginUrl">{{glob.config.user.loginTitle}}</a>
        </div>
        <div v-else class="dropdown">
            <button class="avatar dropdown-toggle" id="dropdownProfileBrief" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span role="img" :style="{'background-image':`url(${profilePhoto})`}"></span>
            </button>
            <div :class="{'dropdown-menu text-center profile-brief':1,'dropdown-menu-right':ltr}" aria-labelledby="dropdownProfileBrief">
                <img class="m-4 mx-5" :src="profilePhoto"/>
                <h2>{{glob.config.user.title}}</h2>
                <div>{{glob.config.user.email}}</div>
                <a class="m-2 btn btn-outline-secondary profile-button" :href="glob.config.user.profileUrl">Profile</a>
                <hr>
                <a class="m-2 btn btn-secondary" href="/logout?f=1">Sign out</a>
                <hr>
                <a class="m-2 text-secondary small" href="/privacy-policy">Privacy Policy</a>
                -
                <a class="m-2 text-secondary small" href="/terms-of-service">Terms of Service</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from "@/main";

    declare let $: any;

    @Component({name: 'AppUserLoginMenu'})
    export default class AppUserLoginMenu extends Vue {
        get profilePhoto(): string {
            return glob.config.user.photoUrl || 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/5bed565…/5f7abfa5-a174-45b5-a5a5-68a91a876506/128';
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
            width: 300px;
        }

        .profile-brief img {
            width: 120px;
            border-radius: 50%;
        }

        .profile-brief .box span {
            width: 100px;
            height: 100px;
        }

        .avatar {
            width: 38px;
            height: 28px;
            background-color: transparent;
            border: none;
            outline: none;

            &::after {
                display: none;
            }
        }

        .avatar span {
            background-color: transparent;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            border-radius: 50%;
            display: flex;
            flex: 1 1 100%;
            width: 100%;
            height: 100%;
            border: 1px solid white;
            cursor: pointer;
        }

        .profile-button {
            width: 200px;
        }
    }
</style>
