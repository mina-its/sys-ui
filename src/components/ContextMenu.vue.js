"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
let ContextMenu = class ContextMenu extends vue_property_decorator_1.Vue {
    click(item) {
        main_1.glob.cmenu.show = false;
        main_1.glob.cmenu.handler(main_1.glob.cmenu.state, item);
    }
    getTitle(item) {
        let title = item.title || '&nbsp;';
        title = title.replace(/\((.+)\)/, "<span class='float-right ml-3 text-secondary'>($1)</span>");
        return title;
    }
    calcMenuPosition() {
        let left, top, right, bottom, width = 0, height = 0;
        let h = $(window).height();
        let w = $(window).width();
        if (main_1.glob.cmenu.event.ctrl) {
            let $c = $(main_1.glob.cmenu.event.ctrl);
            left = right = $c.offset().left;
            top = bottom = $c.offset().top;
            width = $c.outerWidth();
            height = $c.outerHeight();
        }
        else {
            left = right = main_1.glob.cmenu.event.pageX;
            top = bottom = main_1.glob.cmenu.event.pageY;
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
        main_1.glob.cmenu.left = left;
        main_1.glob.cmenu.right = right;
        main_1.glob.cmenu.top = top;
        main_1.glob.cmenu.bottom = bottom;
    }
    get style() {
        this.calcMenuPosition();
        let val = {};
        if (main_1.glob.cmenu.right) {
            val.right = main_1.glob.cmenu.right + 'px';
            val.left = 'auto';
        }
        else
            val.left = main_1.glob.cmenu.left + 'px';
        if (main_1.glob.cmenu.bottom) {
            val.bottom = main_1.glob.cmenu.bottom + 'px';
            val.top = 'auto';
        }
        else
            val.top = main_1.glob.cmenu.top + 'px';
        return val;
    }
};
ContextMenu = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'ContextMenu' })
], ContextMenu);
exports.default = ContextMenu;
//# sourceMappingURL=ContextMenu.vue.js.map