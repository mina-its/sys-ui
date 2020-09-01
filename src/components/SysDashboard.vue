<template>
    <div class="sys-dashboard">
        <div class="d-flex">
            <DashboardInfoBox title="CPU Usage" :value="data.cpuUsage" icon="fa-cog" color="#00c0ef"
                              class="m-4"></DashboardInfoBox>
            <DashboardInfoBox title="Objects" :value="data.objectsCount" icon="fa-anchor" color="#00a65a"
                              class="m-4"></DashboardInfoBox>
            <DashboardInfoBox title="Functions" :value="data.functionsCount" icon="fa-bell-slash" color="#dd4b39"
                              class="m-4"></DashboardInfoBox>
            <DashboardInfoBox title="Users" :value="data.usersCount" icon="fa-user-circle" color="#f39c12"
                              class="m-4"></DashboardInfoBox>
        </div>

        <!--        <div class="p-4">-->
        <!--            <div class="world-map p-4 bg-white">-->
        <!--                <img src="/images/world.svg">-->
        <!--            </div>-->
        <!--        </div>-->
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SysDashboardInfo} from "../../../sys/src/types";

    @Component({name: 'SysDashboard', components: {}})
    export default class SysDashboard extends Vue {
        @Prop() private data: SysDashboardInfo;
    }
</script>

<style scoped lang="scss">
    .sys-dashboard {
        width: 100%;
    }

    .world-map {
        width: 100%;
        border-bottom: 1px solid #f4f4f4;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        border-top: 3px solid #00a65a;
        border-radius: 3px;
    }

    .world-map img {
        width: 100%;
    }
</style>
