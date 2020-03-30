import { __decorate } from "tslib";
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ObjectDetailsViewType } from "../../../sys/src/types";
import { glob } from '@/main';
const main = require("@/main");
let DetailsView = class DetailsView extends Vue {
    mounted() {
        if (this.root) {
            this.currentGroup = this.groups[0];
            glob.headFuncs = [];
            if (this.dec.links)
                for (const link of this.dec.links) {
                    glob.headFuncs.push({ title: link.title, name: link.address["$oid"], exec: this.execLink });
                }
        }
    }
    onPropertyChanged(value, oldValue) {
        this.currentGroup = this.groups[0];
    }
    selectGroup(item) {
        this.currentGroup = item.title;
        history.pushState(null, null, item.ref);
        if (this.dec.detailsViewType == ObjectDetailsViewType.Tabular) {
            let $dv = $(".details-view");
            $dv.animate({
                scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
            }, 0);
        }
    }
    nonGroupVisible() {
        return this.groups.length <= 1;
    }
    groupVisible(group) {
        if (this.groups.length <= 1)
            return false;
        if (this.root)
            return this.dec.detailsViewType == ObjectDetailsViewType.Tabular || this.currentGroup == group;
        else
            return true;
    }
    groupHeadVisible(group) {
        return this.root && this.dec.detailsViewType == ObjectDetailsViewType.Tabular;
    }
    onScroll() {
        main.hideCmenu();
    }
    execLink(cn) {
        let data = { data: this.item };
        main.ajax("/" + cn.name, data, null, main.handleResponse, (err) => {
            main.notify(err);
        });
    }
    changed(prop, instance, val) {
        glob.dirty = true;
        main.checkPropDependencyOnChange(this.dec, prop, instance);
    }
    getProps(group) {
        return this.dec.properties.filter(prop => {
            if (prop.properties)
                return group == prop.title;
            else
                return prop.group == group;
        });
    }
    get sideMenuVisible() {
        return this.sideMenu && this.root && (!this.dec.detailsViewType || this.dec.detailsViewType == ObjectDetailsViewType.Grouped || this.dec.detailsViewType == ObjectDetailsViewType.Tabular);
    }
    get sideMenu() {
        let menus = [];
        for (const grp of this.groups) {
            menus.push({ ref: "#gp-" + grp.replace(/\s/g, "-"), title: grp });
        }
        if (menus.length <= 1)
            menus = null;
        return menus;
    }
    get item() {
        return glob.data[this.uri];
    }
    get groups() {
        let props = this.dec.properties.filter((p) => {
            return p.condition == null || main.evalExpression(this.item, p.condition);
        });
        return props.map((p) => {
            return p.group;
        }).filter(main.onlyUnique);
    }
};
__decorate([
    Prop()
], DetailsView.prototype, "uri", void 0);
__decorate([
    Prop()
], DetailsView.prototype, "root", void 0);
__decorate([
    Prop()
], DetailsView.prototype, "dec", void 0);
__decorate([
    Watch('uri')
], DetailsView.prototype, "onPropertyChanged", null);
DetailsView = __decorate([
    Component
], DetailsView);
export default DetailsView;
//# sourceMappingURL=DetailsView.vue.js.map