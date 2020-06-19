<template>
    <div v-if="glob.modal">
        <transition name="fade">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header text-white bg-dark text-uppercase font-weight-bold">
                                <h5 class="modal-title">{{title}}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" @click="close">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <FormElem v-for="elem in bodyElems" :elem="elem"></FormElem>
                                </form>
                            </div>
                            <div @click="clickNotify" class="modal-body notify-message-container"></div>
                            <div class="modal-footer">
                                <FormElem v-for="elem in footerElems" :elem="elem"></FormElem>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '@/main';
    import * as main from '../main';

    declare let $: any;

    @Component({name: 'Modal', components: {}})
    export default class Modal extends Vue {
        @Prop() private title: string;
        @Prop() private footerElems: any[];
        @Prop() private bodyElems: any[];

        clickNotify() {
            $(".notify-message-container").html("");
        }

        close() {
            glob.modal = false;
            main.load(location.href);
        }
    }
</script>

<style lang="scss">
    .modal-header .close {
        color: white;
    }

    .notify-message-container {

        .notify-message-type- {

            &0, &3 {
                color: #dc3545 !important;
            }

            &4 {
                color: #ffc107 !important;
            }
        }
    }
</style>
