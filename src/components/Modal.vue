<template>
    <div v-if="glob.modal">
        <transition name="fade">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
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
                            <div v-if="glob.notify" class="text-light bg-danger modal-body">
                                <span>{{glob.notify.message}}</span>
                            </div>
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
    import FormElem from "@/components/FormElem.vue";
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '@/main';
    import * as main from '@/main';

    @Component({
        components: {FormElem}
    })
    export default class Modal extends Vue {
        @Prop() private title: string;
        @Prop() private footerElems: any[];
        @Prop() private bodyElems: any[];

        close() {
            glob.modal = false;
            main.load(location.href);
        }
    }
</script>
