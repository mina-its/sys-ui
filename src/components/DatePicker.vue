<template>
    <div class="date-picker w-100 h-100 position-fixed d-flex">
        <div>
            <div class="d-flex flex-row p-3">
                <div class="position-absolute"
                     style="height: 50px; background-color: white;opacity: .6;width: 200px;"></div>
                <div class="position-absolute"
                     style="height: 100px; background-color: white;opacity: .6;border-bottom: 1px solid #aaa;width: 200px;"></div>
                <div class="position-absolute"
                     style="height: 100px; background-color: white;opacity: .6;border-top: 1px solid #aaa;width: 200px;margin-top:150px;"></div>
                <div class="position-absolute"
                     style="height: 50px; background-color: white;opacity: .6;width: 200px;margin-top:200px;"></div>
                <div @scroll="scrollHour" class="hours scroll-content">
                    <ul class="p-0 mb-0 mt-2">
                        <li @click="clickHour(h)"
                            :class="{'px-3':true}"
                            v-for="h in 23">{{addZero(h)}}
                        </li>
                    </ul>
                </div>
                <div @scroll="scrollMinute" class="minutes scroll-content mx-2">
                    <ul class="p-0 mb-0 mt-2">
                        <li @click="clickMinute(m)"
                            :class="{'px-3':true}"
                            v-for="m in 60">{{addZero(m-1)}}
                        </li>
                    </ul>
                </div>
                <div @scroll="scrollSecond" class="seconds scroll-content">
                    <ul class="p-0 mb-0 mt-2">
                        <li @click="clickSecond(s)"
                            :class="{'px-3':true}"
                            v-for="s in 60">{{addZero(s-1)}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="d-flex w-100">
                <button class="flex-fill text-center p-2 border">Set</button>
                <button class="flex-fill text-center p-2 border">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Function from "@/components/Function.vue";

    declare let $: any;

    @Component({components: {Function}})
    export default class DatePicker extends Vue {
        @Prop() private format: string;
        @Prop() private value: string;

        private itemHeight = 50;
        private hour = 1;
        private minute = 1;
        private second = 1;
        private am = false;

        addZero(num) {
            return num < 10 ? '0' + num : num;
        }

        clickHour(h) {
            this.hour = h;
            $(".hours").scrollTop((h - 1) * this.itemHeight);
        }

        clickMinute(m) {
            this.minute = m;
            $(".minutes").scrollTop((m - 1) * this.itemHeight);
        }

        clickSecond(s) {
            this.second = s;
            $(".seconds").scrollTop((s - 1) * this.itemHeight);
        }

        scrollHour() {
            this.hour = Math.round($(".hours").scrollTop() / this.itemHeight) + 1;
            this.hour = Math.min(this.hour, 12);
            if (this.scrollTimer) clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => this.clickHour(this.hour), 200);
        }

        scrollMinute() {
            this.minute = Math.round($(".minutes").scrollTop() / this.itemHeight) + 1;
            this.minute = Math.min(this.minute, 60);
            if (this.scrollTimer) clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => this.clickMinute(this.minute), 200);
        }

        scrollTimer = null;

        scrollSecond() {
            this.second = Math.round($(".seconds").scrollTop() / this.itemHeight) + 1;
            this.second = Math.min(this.second, 60);
            if (this.scrollTimer) clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => this.clickSecond(this.second), 200);

        }
    }
</script>

<style scoped lang="scss">
    .date-picker {
        top: 0;
        left: 0;
        z-index: 2;
        background-color: transparent;
    }

    .date-picker > div {
        margin: auto;
        background-color: white;
        -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    }

    .scroll-content {
        height: 250px;
    }

    .hours, .minutes, .seconds {
        scroll-behavior: smooth;
        padding: 100px 0;
    }

    .hours, .minutes, .seconds, .ampm {
        overflow: scroll;
        -ms-overflow-style: none;
        font-size: 24px;

        &::-webkit-scrollbar {
            display: none;
        }

        li {
            cursor: pointer;
            text-align: center;
            height: 50px;
        }
    }

</style>
