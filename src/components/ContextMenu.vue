<template>
    <div v-if="glob.cmenu.show" :style="style" class="dropdown-menu show overflow-auto context-menu">
        <template v-for="item in glob.cmenu.items">
            <div v-if="item.title==='-'" class="dropdown-divider"></div>
            <a v-else :class="'dropdown-item' + (item.hover ? ' active' : '') " @click="click(item)"
               href="javascript:;" v-html="item.title || '&nbsp;'"></a>
        </template>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from '@/main';
    import $ from 'jquery';
    import * as main from '@/main';

    @Component
    export default class ContextMenu extends Vue {
        click(item) {
            glob.cmenu.show = false;
            glob.cmenu.handler(glob.cmenu.state, item);
        }

        calcMenuPosition() {
            let left, top, right, bottom, width = 0, height = 0;
            let h = $(window).height();
            let w = $(window).width();
            if (glob.cmenu.event.ctrl) {
                let $c = $(glob.cmenu.event.ctrl);
                left = right = $c.offset().left;
                top = bottom = $c.offset().top;
                width = $c.outerWidth();
                height = $c.outerHeight();
            } else {
                left = right = glob.cmenu.event.pageX;
                top = bottom = glob.cmenu.event.pageY;
            }

            if (h - bottom < 300)
                bottom = h - top;
            else {
                bottom = 0;
                top = top + height;
            }

            if (main.isRtl() || left > w - 300)
                right = w - left - width;
            else
                right = 0;

            glob.cmenu.left = left;
            glob.cmenu.right = right;
            glob.cmenu.top = top;
            glob.cmenu.bottom = bottom;
        }

        get style() {
            this.calcMenuPosition();
            let val: any = {};

            if (glob.cmenu.right) {
                val.right = glob.cmenu.right + 'px';
                val.left = 'auto';
            } else
                val.left = glob.cmenu.left + 'px';

            if (glob.cmenu.bottom) {
                val.bottom = glob.cmenu.bottom + 'px';
                val.top = 'auto';
            } else
                val.top = glob.cmenu.top + 'px';
            return val;
        }
    }
</script>

<style lang="scss">
    .context-menu {
        max-height: 300px;
    }

    .dropdown-item {
        line-height: 1.3;
    }
</style>
