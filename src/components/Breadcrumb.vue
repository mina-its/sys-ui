<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb p-0 m-0 bg-transparent">
            <li v-for="item in glob.form.breadcrumb" class="breadcrumb-item">
                <a :href="item.ref">{{item.title}}</a>
                <i :class="{'fa my-1':1 ,'fa-chevron-right ml-2':ltr, 'fa-chevron-left mr-2':rtl}"></i>
            </li>
            <li class="breadcrumb-item font-weight-bold active" aria-current="page">{{glob.form.breadcrumbLast}}<span class="text-muted px-2" v-if="count">({{countTitle}})</span></li>
        </ol>
    </nav>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {digitGroup} from '@/main';

    @Component({name: 'Breadcrumb'})
    export default class Breadcrumb extends Vue {
        @Prop() private count?: number;

        get countTitle(){
            return digitGroup(this.count);
        }
    }
</script>

<style scoped lang="scss">

</style>
