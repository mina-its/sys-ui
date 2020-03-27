<template>
    <transition name="fade">
        <div v-if="st.notify && !st.modal" ref="notifyBox" id="notify-box" :class="'text-left w-100 navbar notify-type-'+st.notify.type" role="alert" @click="st.notify=null;">
	    <span>
	    	<i v-if="st.notify.type==3" class="m-1 fa fa-exclamation-circle fa-2x"></i>
	    	<i v-if="st.notify.type==4" class="m-1 fa fa-exclamation-triangle fa-2x"></i>
	    	<i v-if="st.notify.type==6" class="m-1 fa fa-info-circle fa-2x"></i>
	    </span>
            <span class="mx-3 flex-grow-1 notify-message">{{st.notify.message}}</span>
        </div>
    </transition>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class NotifyBox extends Vue {
		@Prop() private prop!: string;
	}
</script>

<style lang="scss">
    #notify-box {
        position: absolute;
        left: 0;
        top: 2px;
        z-index: 100000;
        cursor: pointer;
        color: white;

        &.notify-type-4 {
            background-color: theme-color("warning");
        }

        &.notify-type-3 {
            background-color: theme-color("danger");
        }

        &.notify-type-6 {
            background-color: theme-color("primary");
        }
    }
</style>
