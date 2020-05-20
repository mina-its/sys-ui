<template>
    <transition name="fade">
        <div v-if="glob.question.show" id="question-box">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header text-white bg-dark text-uppercase font-weight-bold">
                                <h5 class="modal-title">{{glob.question.title}}</h5>
                                <button type="button" @click="close" class="close"><span aria-hidden="true">×</span></button>
                            </div>
                            <div class="modal-body d-flex align-items-center">
                                <div class="flex-grow-1 mx-2" v-html="message"></div>
                            </div>
                            <div class="modal-footer">
                                <button @click="select(button.ref)" :class="button._cs || 'btn btn-primary'" v-for="button in glob.question.buttons">{{button.title}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
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

<style scoped lang="scss">
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to
    {
        opacity: 0;
    }

</style>
