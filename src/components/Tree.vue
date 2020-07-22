<template>
    <ul class="nav flex-column tree">
        <li v-for="item in items" class="nav-item">
            <div class="d-flex align-items-center">
                <i v-if="item.items" class="fas fa-lg fa-caret-down pr-2"></i>
                <div v-else class="pr-4"></div>
                <a @click="$emit('select', item)" :class="{'text-nowrap text-secondary nav-link':1,'active':isActive(item)}"
                   :href="item.ref ? item.ref : 'javascript:void(0);'">{{item.title}}</a>
            </div>
            <tree @select="$emit('select', $event)" class="ml-3" v-if="item.items" :items="item.items"></tree>
        </li>
    </ul>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {TreePair} from '../../../sys/src/types';

    @Component({name: 'Tree'})
    export default class Tree extends Vue {
        @Prop() private items: TreePair[];

        isActive(item: TreePair) {
            return location.pathname == item.ref;
        }
    }
</script>

<style lang="scss">
    .tree.nav {
        .nav-link:hover {
            color: var(--primary) !important;
        }

        .nav-link.active {
            font-weight: bold;
            color: var(--primary) !important;
        }
    }
</style>