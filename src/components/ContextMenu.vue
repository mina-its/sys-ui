<template>
    <div v-if="glob.cmenu.show" :style="style" class="dropdown-menu py-0 show overflow-auto context-menu text-start">
        <DateTimePicker v-if="glob.cmenu.datePicker" :format="glob.cmenu.datePicker.format" :value="glob.cmenu.datePicker.value" @changed="dateChanged" @canceled="glob.cmenu.show=false"/>
        <JalaliDateTimePicker v-if="glob.cmenu.jalaliDatePicker" @changed="dateChanged" @canceled="glob.cmenu.show=false"/>
        <div v-else class="py-2">
            <template v-for="item in glob.cmenu.items">
                <div v-if="item.title==='-'" class="dropdown-divider"></div>
                <div v-else-if="item.ref==null && item.title" class="dropdown-header" v-html="getTitle(item)"></div>
                <a v-else :class="getStyle(item)" @click="click(item)" href="javascript:;" v-html="getTitle(item)">
                    <i v-if="item.icon" :class="item.icon"></i>
                </a>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {glob} from '../main';
    import * as main from '../main';
    import {MenuItem} from "../types";
    import JalaliDateTimePicker from "./JalaliDateTimePicker.vue";

    declare let $: any;

    @Component({name: 'ContextMenu',
        components: {JalaliDateTimePicker}
    })
    export default class ContextMenu extends Vue {
        click(item) {
            glob.cmenu.show = false;
            glob.cmenu.handler(glob.cmenu.state, item);
        }

        dateChanged(val) {
            glob.cmenu.show = false;
            glob.cmenu.handler(glob.cmenu.state, val);
        }

        getStyle(item: MenuItem) {
            let style = 'dropdown-item text-nowrap';
            if (item._cs) style += ' ' + item._cs;
            if (item.hover) style += ' active';
            return style;
        }

        getTitle(item: MenuItem) {
            let title = item.title || '&nbsp;';
            //title = title.replace(/\((.+)\)/, "<span class='float-right ml-3 text-dark'>($1)</span>"); // timeZones list problem
            return title;
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
        max-height: 400px;
    }

    .dropdown-item {
        line-height: 1.3;
    }
</style>
