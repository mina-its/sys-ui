<template>
    <layout-default title="My Account">
        <template slot="main-content">
            <div v-if="userDec" class="my-account p-4 w-100">
                <div class="bg-white border p-4 rounded-bottom">
                    <DetailsView @changed="changed" :data="user" :dec="userDec" :level="1"/>

                    <hr>
                    <span class="pr-3 mr-3 border-right" v-if="modify">
                <Function styles="btn-success" @exec="apply" name="apply" :title="$t('save-changes')"></Function>
            </span>
                    <a href="/resetPassword?f=1" class="btn btn-success">Change Password</a>
                    <a href="/signout?f=1" class="mx-2 btn btn-dark">Signout</a>
                </div>
            </div>
        </template>
    </layout-default>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {LogType, WebMethod, StatusCode, ObjectDec, UserProfile} from '../../../sys/src/types';
    import {$t, ajax, call, notify, prepareServerUrl} from "../main";
    import {ItemChangeEventArg, Modify} from "../types";

    @Component({name: 'MyAccount'})
    export default class MyAccount extends Vue {
        private userDec: ObjectDec = null;
        private user: UserProfile = null;
        private changes: UserProfile = null;
        private modify: Modify = null;

        changed(e: ItemChangeEventArg) {
            this.modify = this.modify || {data: {}, type: e.type, ref: "users/" + this.user._id, state: this.user} as Modify;
            this.modify.data[e.prop.name] = e.val || null;
        }

        apply(e) {
            ajax(prepareServerUrl(this.modify.ref), this.modify.data, {method: WebMethod.patch}, (res) => {
                this.modify = null;
                notify($t('saved'), LogType.Debug);
            }, notify);
        }

        created() {
            let ref = 'getUserAccountInfo';
            call(ref, null, (err, res) => {
                if (err || !res)
                    return notify(err, LogType.Error);

                if (res.code == StatusCode.Unauthorized) {
                    location.href = "/signin";
                    return;
                }

                this.userDec = res.form.declarations[ref];
                this.user = res.data[ref];
            });
        }

    }
</script>

<style lang="scss">
    .my-account {

    }
</style>
