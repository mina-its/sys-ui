<template>
    <layout-default title="My Account">
        <template slot="main-content">
            <div v-if="userDec" class="my-account p-4 bg-white border">
                <DetailsView @changed="changed" :data="user" :dec="userDec" :level="1"/>
            </div>
        </template>
        <template slot="toolbar-customs">
            <div v-if="modify" role="group" class="border-left border-2 mx-2 px-2">
                <button style="width: 6rem" class="btn border-chip btn-success mx-1" @click="apply"><i class="fal fa-check-circle"></i> {{$t('apply')}}</button>
                <button style="width: 6rem" class="btn border-chip btn-light mx-1" @click="cancel" name="cancel">{{$t('cancel')}}</button>
            </div>
        </template>
    </layout-default>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {AccessAction, LogType, ObjectDec, StatusCode, UserProfile, WebMethod} from '../../../sys/src/types';
    import {$t, call, glob, notify} from "../main";
    import {ItemChangeEventArg} from "../types";

    @Component({name: 'MyAccount'})
    export default class MyAccount extends Vue {
        private userDec: ObjectDec = null;
        private user: UserProfile = null;
        private modify: {} = null;

        changed(e: ItemChangeEventArg) {
            this.modify = this.modify || {};
            this.modify[e.prop.name] = e.val || null;
        }

        cancel() {
            location.href = location.href;
        }

        apply(e) {
            call("updateUserAccountInfo", {user: this.modify}, (err, res) => {
                if (err) {
                    notify(err, LogType.Error);
                    return;
                }
                this.modify = null;
                notify($t('saved'), LogType.Debug);
            });
        }

        created() {
            let ref = 'getUserAccountInfo';
            call(ref, null, (err, res) => {
                if (err || !res)
                    return notify(err, LogType.Error);

                if (res.code == StatusCode.Unauthorized) {
                    location.href = `/authCheck?back=${location.href}`;
                    return;
                }

                let dec = res.form.declarations[ref];
                dec.access = AccessAction.Full;
                this.userDec = dec;
                this.user = res.data[ref];
            });
        }

    }
</script>

<style lang="scss">
    .my-account {

    }
</style>
