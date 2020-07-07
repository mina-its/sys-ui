<template>
    <div v-if="glob.question.show" class="question-box">
        <div class="overlay"></div>
        <div class="main p-3">
            <div class="main-title font-weight-bold">{{glob.question.title}}</div>
            <div class="main-message" v-html="message"></div>
            <div class="main-footer text-right pt-3">
                <button @click="select(button.ref)" :class="button._cs || 'btn btn-primary mx-1'" v-for="button in glob.question.buttons">{{button.title}}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {FunctionExecEventArg} from '@/types';
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from '@/main';
    import {Pair} from '../../../sys/src/types';

    declare let marked: any;

    @Component({name: 'QuestionBox', components: {}})
    export default class QuestionBox extends Vue {
        close() {
            this.select(null);
        }

        select(ref: any) {
            glob.question.select(ref);
            glob.question.buttons = []; // to not send again null
            glob.question.show = false;
            this.$forceUpdate();
        }

        get message() {
            if (glob.question.message)
                return marked(glob.question.message);
            else
                return "";
        }
    }
</script>

<style lang="scss">
    .question-box {
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

        .btn{
            border-radius: 0.1rem;
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
