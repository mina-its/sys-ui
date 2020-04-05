<template>
    <div v-if="glob.question.show" id="question-box">
        <transition name="fade">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <i class="fa fa-question-circle fa-2x text-muted"></i>
                                <span aria-hidden="true" @click="close">&times;</span>
                            </div>
                            <div class="modal-body d-flex align-items-center">
                                <div class="flex-grow-1 mx-2" v-html="message"></div>
                            </div>
                            <div class="modal-footer">
                                <Function styles="btn-primary" :title="option.title"
                                          @exec="select({...$event, data: option})"
                                          :key="option.ref"
                                          v-for="option in glob.question.options"></Function>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {FunctionExecEventArg} from "@/types";
    import Function from "@/components/Function.vue";
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from "@/main";
    import {Pair} from '../../../sys/src/types';

    declare let marked: any;

    @Component({components: {Function}})
    export default class QuestionBox extends Vue {
        close() {
            glob.question.show = false;
            if (glob.question.options.length)
                glob.question.select(null);
        }

        select(e: FunctionExecEventArg) {
            let option = e.data as Pair;
            glob.question.select(option);
            glob.question.options = []; // to not send again null
            glob.question.show = false;
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
    #question-box {
        background-color: #5555;

        .modal-header {
            color: #ffc4c4 !important;
        }

        .modal-body {
            font-weight: 500;
        }

        .btn {
            min-width: 75px;
        }
    }
</style>
