<template>
    <div v-if="st.cmenu.show" :style="style" class="dropdown-menu show overflow-auto context-menu">
        <template v-for="item in st.cmenu.items">
            <div v-if="item.title=='-'" class="dropdown-divider"></div>
            <a v-else :class="'dropdown-item' + (item.hover ? ' active' : '') " @click="click(item)"
               href="javascript:;">{{item.title || '&nbsp;'}}</a>
        </template>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType} from "../../../sys/src/types";

	@Component
	export default class ContextMenu extends Vue {
		click(item) {
			st.cmenu.show = false;
			st.cmenu.handler(st.cmenu.state, item);
		}

		calcMenuPosition() {
			let left, top, right, bottom, width = 0, height = 0;
			let h = $(window).height();
			let w = $(window).width();
			if (st.cmenu.event.ctrl) {
				let $c = $(st.cmenu.event.ctrl);
				left = right = $c.offset().left;
				top = bottom = $c.offset().top;
				width = $c.outerWidth();
				height = $c.outerHeight();
			} else {
				left = right = st.cmenu.event.pageX;
				top = bottom = st.cmenu.event.pageY;
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

			st.cmenu.left = left;
			st.cmenu.right = right;
			st.cmenu.top = top;
			st.cmenu.bottom = bottom;
		}

		get style() {
			this.calcMenuPosition();
			let val: any = {};

			if (st.cmenu.right) {
				val.right = st.cmenu.right + 'px';
				val.left = 'auto';
			} else
				val.left = st.cmenu.left + 'px';

			if (st.cmenu.bottom) {
				val.bottom = st.cmenu.bottom + 'px';
				val.top = 'auto';
			} else
				val.top = st.cmenu.top + 'px';
			return val;
		}
	}
</script>

<style lang="scss">
    .context-menu {
        max-height: 300px;
    }
</style>
