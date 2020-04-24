<template>
    <div class="info-box d-flex">
        <span class="info-box-icon flex-column" :style="{'background-color': color}">
            <i :class="`fa ${icon}`"></i>
        </span>

        <div class="p-2 flex-column">
            <div class="info-box-text">{{title}}</div>
            <div class="info-box-number font-weight-bold">{{value}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectViewType} from "../../../sys/src/types";

    @Component
    export default class DashboardInfoBox extends Vue {
        @Prop() private color: string;
        @Prop() private title: string;
        @Prop() private value: string;
        @Prop() private icon: string;
    }
</script>

<style lang="scss">
    .info-box {
        display: block;
        min-height: 90px;
        background: #fff;
        width: 100%;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        margin-bottom: 15px;

        .info-box-icon {
            border-top-left-radius: 2px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 2px;
            display: block;
            float: left;
            color: white;
            height: 90px;
            width: 90px;
            text-align: center;
            font-size: 45px;
            line-height: 90px;
            background: rgba(0, 0, 0, 0.2);
        }

        .info-box-text {
            white-space: nowrap;
            min-width: 100px;
        }
    }
</style>
