<template>
    <transition name="fade">
        <div v-if="glob.notify && !glob.modal && glob.notify.message" ref="notifyBox" id="notify-box"
             :class="'text-left w-100 navbar notify-type-'+glob.notify.type" role="alert" @click="glob.notify=null">
	    <span>
	    	<i v-if="glob.notify.type===3" class="m-1 fa fa-exclamation-circle fa-2x"></i>
	    	<i v-if="glob.notify.type===4" class="m-1 fa fa-exclamation-triangle fa-2x"></i>
	    	<i v-if="glob.notify.type===6" class="m-1 fa fa-info-circle fa-2x"></i>
	    </span>
            <span class="mx-3 flex-grow-1 notify-message">{{glob.notify.message}}</span>
        </div>
    </transition>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'NotifyBox'})
    export default class NotifyBox extends Vue {
    }
</script>

<style lang="scss">
    #notify-box {
        position: absolute;
        left: 0;
        top: 1px;
        z-index: 100000;
        cursor: pointer;
        color: white;
        border-bottom: 1px solid #333;

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
