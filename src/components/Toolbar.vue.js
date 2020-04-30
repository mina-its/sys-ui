"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const main_1 = require("@/main");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("../main"));
let Toolbar = class Toolbar extends vue_property_decorator_1.Vue {
    mounted() {
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.which == types_1.Keys.s) {
                this.apply({});
                e.preventDefault();
            }
        });
    }
    newItem() {
        main.load(location.pathname + '?n=1', true);
    }
    cancel(e) {
        main.clearModifies();
        if (main.getQs("n") == "true")
            location.href = location.pathname;
        else {
            main.load(location.pathname);
        }
    }
    clickTitlePin(e) {
        let items = [
            { ref: "export-excel", title: main_1.$t('export-excel') },
            { ref: "export-csv", title: main_1.$t('export-csv') },
            { ref: "export-pdf", title: main_1.$t('export-pdf') },
            { title: "-" },
            { ref: "import", title: main_1.$t('import') },
            { title: "-" },
            { ref: "print", title: main_1.$t('print') },
        ];
        main.showCmenu(null, items, e.event, (state, item) => {
            switch (item.ref) {
                case "export-excel":
                    break;
                case "export-csv":
                    break;
                case "print":
                    window.print();
                    break;
            }
        });
    }
    apply(e) {
        main_1.glob.notify = null;
        if (!e.stopProgress)
            e.stopProgress = () => main.log('Apply done!');
        if (!main.validate(this.$store.state.data))
            return e.stopProgress();
        // todo: if (main.getQs("n") == "true") return main.commitNewItem();
        main.dispatchRequestServerModify(this.$store, e.stopProgress);
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Toolbar.prototype, "alwaysVisible", void 0);
Toolbar = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'Toolbar', components: {} })
], Toolbar);
exports.default = Toolbar;
//# sourceMappingURL=Toolbar.vue.js.map