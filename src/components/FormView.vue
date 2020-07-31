<template>
    <div class="form-view h-100 overflow-auto w-100 d-flex" @scroll="onScroll()">
        <FormElem v-for="elem in glob.form.elems" :elem="elem" />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {hideCmenu} from "../main";

    @Component({name: 'FormView', components: {}})
    export default class FormView extends Vue {
        onScroll() {
            hideCmenu();
        }
    }
</script>
