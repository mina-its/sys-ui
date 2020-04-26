<template>
    <div class="roll-picker d-flex">
        <hr class="position-absolute" style="margin-top: 100px;">
        <hr class="position-absolute" style="margin-top: 150px;">
        <span class="px-1 caption position-absolute text-secondary" style="margin-top: 100px;">{{caption}}</span>
        <div @scroll="scroll" ref="sc" class="scroll-content w-100" :style="{'padding': (itemHeight*2)+'px 0'}">
            <ul class="p-0 mb-0">
                <li @click="click(index)"
                    :class="{'px-3 text-center pt-2':true, 'level0': itemStyle(index, 0), 'level1': itemStyle(index, 1), 'level2': itemStyle(index, 2)}"
                    :style="{'height': itemHeight+'px'}"
                    v-for="(item, index) in items">{{item}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';

    declare let $: any;

    @Component({name: 'RollPicker'})
    export default class RollPicker extends Vue {
        @Prop() private items: string[];
        @Prop() private index: number;
        @Prop() private caption: string;

        private itemHeight = 50;
        private scrollTop = 0;

        mounted() {
            this.$refs.sc.scrollTop = this.index * this.itemHeight;
            $(this.$refs.sc).css("scroll-behavior", "smooth");
        }

        $refs: {
            sc
        };

        itemStyle(index, level) {
            let offset = index - Math.round(this.scrollTop / this.itemHeight);
            return level == Math.abs(offset);
        }

        click(index) {
            this.$refs.sc.scrollTop = index * this.itemHeight;
        }

        @Emit('changed')
        change(index) {
            return {index, item: this.items[index]};
        }

        scroll() {
            this.scrollTop = this.$refs.sc.scrollTop;
            let index = Math.round(this.scrollTop / this.itemHeight);
            if (this.index != index)
                this.change(index);
        }
    }
</script>

<style scoped lang="scss">
    .roll-picker {
        width: 70px;
    }

    hr {
        width: 70px;
    }

    .caption {
        font-size: 10px;
    }

    .scroll-content {
        overflow: scroll;
        -ms-overflow-style: none;
        font-size: 24px;
        height: 250px;


        &::-webkit-scrollbar {
            display: none;
        }

        li {
            cursor: pointer;
            white-space: nowrap;

            &.level0 {
                font-weight: bold;
            }

            &.level1 {
                color: #888;
            }

            &.level2 {
                color: #e0e0e0;
                font-size: smaller;
            }
        }
    }
</style>
