<template>
    <div class="message-box">
        <div class="overlay"></div>
        <div class="main p-5">
            <button @click="close" class="btn btn-link position-absolute" style="top:0;right:0"><i class="fal fa-times"></i></button>
            <div class="main-title font-weight-bold">{{title}}</div>
            <div class="main-message" v-html="message"></div>
            <slot name="content"></slot>
            <div class="main-footer text-right">
                <slot name="buttons"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';

    declare let $, marked: any;

    @Component({name: 'MessageBox', components: {}})
    export default class MessageBox extends Vue {
        @Prop() private title: string;
        @Prop() private message: string;

        close() {
        }
    }
</script>

<style lang="scss">
    .message-box {
        background-color: transparent;
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .overlay {
            background-color: rgba(0, 0, 0, 0.4);
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: absolute;
        }

        .btn {
            border-radius: 0.1rem;
            min-width: 5rem;
        }

        .main {
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            font-weight: 400;
            box-shadow: rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px 14.4px 0px;
            background-color: rgb(255, 255, 255);
            box-sizing: border-box;
            position: relative;
            text-align: left;
            max-height: 100%;
            overflow-y: auto;
            border-radius: 2px;
            outline: transparent solid 3px;
        }
    }
</style>
