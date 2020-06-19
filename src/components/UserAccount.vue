<template>
    <div v-if="userDec" class="user-account p-4 w-100">
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

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {LogType, ObjectDec, StatusCode, User, WebMethod} from "../../../sys/src/types";
    import sys from "../../../sys-ui";
    import {ItemChangeEventArg, Modify} from "@/types";
    import {$t, prepareServerUrl} from "@/main";
    import * as main from '../main';

    @Component({name: 'UserAccount', components: {}})
    export default class UserAccount extends Vue {
        private userDec: ObjectDec = null;
        private user: User = null;
        private changes: User = null;
        private modify: Modify = null;

        changed(e: ItemChangeEventArg) {
            this.modify = this.modify || {data: {}, type: e.type, ref: "users/" + this.user._id, state: this.user} as Modify;
            this.modify.data[e.prop.name] = e.val || null;
        }

        apply(e) {
            main.ajax(prepareServerUrl(this.modify.ref), this.modify.data, {method: WebMethod.patch}, (res) => {
                this.modify = null;
                main.notify($t('saved'), LogType.Debug);
            }, main.notify);
        }

        created() {
            let ref = 'getUserAccountInfo';
            sys.call(ref, null, (err, res) => {
                if (err || !res)
                    return sys.notify(err, LogType.Error);

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

<style scoped lang="scss">

</style>
