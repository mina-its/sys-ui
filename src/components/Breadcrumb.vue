<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-0 m-0 bg-transparent d-flex align-items-center">
            <li style="margin-inline-end: 1rem">
                <button title="Go Back" @click="goBack" class="btn hover-opacity btn-link px-1 py-0">
                    <i :class="{'fal text-secondary fa-2x':1,'fa-arrow-circle-left':ltr, 'fa-arrow-circle-right':rtl}"></i>
                </button>
            </li>
            <li v-for="item in breadcrumb" class="breadcrumb-item">
                <a :href="item.ref">{{item.title}}</a>
                <i :class="{'fa my-1':1 ,'fa-chevron-right ml-2':ltr, 'fa-chevron-left mr-2':rtl}"></i>
            </li>
            <li class="breadcrumb-item d-flex align-items-center font-weight-bold active" aria-current="page">
                <div>{{title}}</div>
                <span class="text-muted small px-1" v-if="count">({{countTitle}})</span>
            </li>
        </ol>
    </nav>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {digitGroup} from '@/main';

    @Component({name: 'Breadcrumb'})
    export default class Breadcrumb extends Vue {
        @Prop() private count?: number;
        @Prop() private breadcrumb: any[];
        @Prop() private title: string;

        goBack() {
            history.back();
        }

        get countTitle() {
            return digitGroup(this.count);
        }
    }
</script>

<style lang="scss">
    .breadcrumb-item {
        font-weight: 500;

        + .breadcrumb-item {
            padding-left: 0rem;

            &::before {
                padding-right: 0.5rem;
                padding-left: 0;
                content: "";
            }
        }

        i {
            color: var(--breadcrumb-separator);
        }
    }
</style>
