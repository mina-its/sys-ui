<template>
    <div v-if="glob.dirty" class="mx-2" role="group">
        <button class="btn btn-primary" @click="apply">{{$t('apply')}}</button>
        <button class="btn btn-link" @click="cancel" name="cancel">{{$t('cancel')}}</button>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Constants, FunctionExecEventArg} from "@/types";
    import {glob} from "@/main";
    import * as main from '../main';
    import {Keys} from '../../../sys/src/types';

    @Component({name: 'ToolbarModifyButtons'})
    export default class ToolbarModifyButtons extends Vue {
        apply() {
            glob.notify = null;
            if (!main.validate(this.$store.state.data)) return;
            // todo: if (main.getQs("n") == "true") return main.commitNewItem();
            main.dispatchRequestServerModify(this.$store, () => {
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
