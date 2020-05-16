<template>
    <div class="main-body h-100 overflow-auto w-100 d-flex" @scroll="onScroll()">
        <FormElem v-for="elem in glob.form.elems" :elem="elem" :key="elem.id"></FormElem>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as main from "@/main";

    @Component({name: 'FormView', components: {}})
    export default class FormView extends Vue {
        onScroll() {
            main.hideCmenu();
        }
    }
</script>
