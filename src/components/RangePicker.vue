<template>
    <div class="p-5">
        <div class="range-picker">
            <span @click="showMenu" contenteditable="true" class="">{{value}}</span>
            <div :class="{'context-menu': true, 'd-none': !menuVisible}">
                <div>UP</div>
                <div>2010</div>
                <div>2011</div>
                <div>2012</div>
                <div>2013</div>
                <div>Down</div>
            </div>
        </div>
        <span>/</span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Pair} from "../../../sys/src/types";

    @Component({components: {}})
    export default class RangePicker extends Vue {
        @Prop() private pair: Pair;
        @Prop() private value: string;

        menuVisible = false;

        showMenu() {
            this.menuVisible = true;
        }
    }
</script>

<style lang="scss">
    .range-picker {
        display: inline-block;

        input {

        }
    }
</style>
