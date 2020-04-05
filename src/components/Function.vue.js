"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main = tslib_1.__importStar(require("@/main"));
const main_1 = require("@/main");
let Function = class Function extends vue_property_decorator_1.Vue {
    constructor() {
        super(...arguments);
        this.showProgress = false;
        this.spinnerTimer = null;
    }
    render(ce) {
        if (this.styles && this.styles.indexOf('fa-') > -1)
            return ce('div', [
                ce('button', {
                    attrs: { "class": "btn" },
                    on: { click: this.click },
                }, [
                    ce('i', { attrs: { "class": "fa " + this.styles } })
                ])
            ]);
        else
            return ce('div', { attrs: { "class": "d-inline-block" } }, [
                ce('button', {
                    attrs: { "class": 'btn ' + (this.styles || 'btn-primary m-1') },
                    on: { click: this.click },
                }, [
                    ce('span', this.title),
                    ce('i', { attrs: { "class": `ml-2 fa fa-sync fa-spin wait-spinner ${(this.showProgress ? "" : "d-none")}` } })
                ])
            ]);
    }
    validate(data) {
        let dec = main.getDec(data);
        if (dec && dec.properties) {
            let requiredProps = dec.properties.filter(p => p.required);
            let error = "";
            for (const prop of requiredProps) {
                if (data[prop.name] === null || data[prop.name] === "") {
                    error = error || `value is required for property '${prop.title}'`;
                    main.setPropertyEmbeddedError(data, prop.name, `* mandatory`);
                }
            }
            if (error) {
                main.notify(error, types_1.LogType.Error);
                return false;
            }
        }
        return true;
    }
    emitExec(e) {
        return e;
    }
    click(e) {
        this.showProgress = true;
        if (this.$listeners && this.$listeners.exec) {
            try {
                let $this = this;
                let arg = {
                    name: this.name, data: this.$store.state.data, stopProgress() {
                        $this.showProgress = false;
                    }
                };
                this.$emit('exec', arg);
            }
            catch (ex) {
                this.showProgress = false;
                console.error(`function '${this.name}' click error.`, ex);
            }
        }
        else {
            let functionName = this.name;
            if (!this.data)
                throw `data must be set for 'Function' element '${functionName}'`;
            let dec = main.getDec(this.data);
            if (!this.validate(this.data))
                return;
            main.log(`calling '${this.name}' ...`, this.data);
            main.ajax("/" + this.name, this.data, null, (res) => {
                this.showProgress = false;
                if (dec.interactive && res.code == types_1.StatusCode.Accepted)
                    return;
                else if (res.code != types_1.StatusCode.Ok)
                    main.notify(res.message, types_1.LogType.Error);
                else {
                    main_1.glob.modal = false;
                    setTimeout(() => {
                        main.handleResponse(res);
                    }, 100);
                }
            }, (err) => {
                this.showProgress = false;
                main.notify(err);
            });
        }
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Function.prototype, "title", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Function.prototype, "name", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Function.prototype, "data", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], Function.prototype, "styles", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('exec')
], Function.prototype, "emitExec", null);
Function = tslib_1.__decorate([
    vue_property_decorator_1.Component
], Function);
exports.default = Function;
//# sourceMappingURL=Function.vue.js.map