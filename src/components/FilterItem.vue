<template>
    <span class="filter-item py-2 badge badge-pill badge-info">{{item.title}}
        <i @click="close" class="fas fa-times ml-2"></i>
    </span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectDec} from "../../../sys/src/types";

    @Component({name: 'FilterItem'})
    export default class FilterItem extends Vue {
        @Prop() private item: any;
        @Prop() private dec: ObjectDec;

        close() {
            // this.meta.filter.items = this.meta.filter.items.filter(item => {
            // 	return item.id !== this.item.id;
            // });
        }
    }
</script>

<style scoped lang="scss">

</style>
