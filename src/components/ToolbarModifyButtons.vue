<template>
    <div v-if="glob.dirty" role="group" class="border-left border-2 mx-2 px-2">
        <button style="width: 6rem" class="btn border-chip btn-success mx-1" @click="apply"><i class="fal fa-check-circle"></i> {{$t('apply')}}</button>
        <button style="width: 6rem" class="btn border-chip btn-light mx-1" @click="cancel" name="cancel">{{$t('cancel')}}</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Constants} from "../types";
    import {glob} from "../main";
    import * as main from '../main';
    import {Keys} from '../../../sys/src/types';

    @Component({name: 'ToolbarModifyButtons'})
    export default class ToolbarModifyButtons extends Vue {
        apply() {
            glob.notify = null;
            if (!main.validate(this["$store"].state.data)) return;
            // todo: if (main.getQs("n") == "true") return main.commitNewItem();
            main.dispatchRequestServerModify(this["$store"], () => {
                // main.log('Apply done!')
            });
        }

        mounted() {
            window.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.ctrlKey && e.which == Keys.s) {
                    this.apply();
                    e.preventDefault();
                }
            });
        }

        cancel() {
            main.clearModifies();
            main.load(location.pathname, !!main.getQs(Constants.QUERY_NEW));
        }
    }
</script>

<style scoped lang="scss">

</style>
