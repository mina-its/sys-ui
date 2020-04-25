<template>
    <div class="tree-view-line m-2">
        <span :class="'tree-view-head token mr-2' + (line.head ? '' : ' empty')">{{line.head}}</span>
        <label class="tree-view-subject">
            <prop :viewType="3" :labelMode="1" :item="line.item" v-if="line.item" :meta="line.subject"></prop>
        </label>
        <tree-view-attribute v-for="attr in line.attrs" :attr="attr"></tree-view-attribute>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component({name: 'TreeViewLine'})
    export default class TreeViewLine extends Vue {
        @Prop() private line: any;
    }
</script>

<style scoped lang="scss">

</style>
