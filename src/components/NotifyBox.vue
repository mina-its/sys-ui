<template>
    <transition name="fade">
        <div v-if="glob.notify && !glob.modal && glob.notify.message" ref="notifyBox" id="notify-box"
             :class="'text-left w-100 navbar notify-type-'+glob.notify.type" role="alert" @click="glob.notify=null">
            <i :class="{'my-1 fal fa-2x':1,
            'fa-exclamation-circle':glob.notify.type===3 && !isNetworkError,
            'fa-exclamation-triangle':glob.notify.type===4,
            'fa-wifi-slash':isNetworkError,
            'fa-info-circle':glob.notify.type===6}"></i>
            <span class="mx-3 flex-grow-1 notify-message">{{glob.notify.message}}</span>
            <i class="fal px-3 fa-times"></i>
        </div>
    </transition>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from "../main";

    @Component({name: 'NotifyBox'})
    export default class NotifyBox extends Vue {
        get isNetworkError() {
            return glob.notify.message == "Error: Network Error";
        }
    }
</script>

<style lang="scss">
    #notify-box {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 100000;
        cursor: pointer;
        color: white;
        border-bottom: 1px solid #333;
        border-top: 1px solid #333;

        &.notify-type-4 {
            background-color: var(--warning);
        }

        &.notify-type-3 {
            background-color: var(--danger);
        }

        &.notify-type-6 {
            background-color: var(--primary);
        }
    }
</style>
