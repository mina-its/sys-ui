<template>
    <div contenteditable="true" ref="el" @input="updateHTML" class="d-block w-100 border-0"></div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';

    @Component({name: 'DocumentEditor'})
    export default class DocumentEditor extends Vue {
        @Prop() private value: string;

        mounted() {
            this.$el.innerHTML = JSON.stringify(this.value);
        }

        @Emit('input')
        updateHTML(e) {
            try {
                let val = JSON.parse(e.target.innerHTML);
                Object.assign(this.value, val);
            } catch (ex) {
            }
            return {val: e.target.innerHTML};
        }
    }
</script>

<style scoped lang="scss">

</style>
