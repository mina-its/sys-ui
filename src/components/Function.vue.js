import { __decorate } from "tslib";
import { Component, Prop, Vue } from 'vue-property-decorator';
import { LogType, StatusCode } from "../../../sys/src/types";
import { glob } from '@/main';
const main = require("@/main");
let Function = class Function extends Vue {
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
        let dec = data._.dec;
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
                main.notify(error, LogType.Error);
                return false;
            }
        }
        return true;
    }
    click(e) {
        this.showProgress = true;
        if (this.$listeners && this.$listeners.exec) {
            let cn = { event: e, name: this.name, data: glob.data };
            try {
                this.$emit('exec', cn, () => {
                    this.showProgress = false;
                });
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
            let dec = this.data._.dec;
            if (!this.validate(this.data))
                return;
            main.log(`calling '${this.name}' ...`, this.data);
            main.ajax("/" + this.name, this.data, null, (res) => {
                this.showProgress = false;
                if (dec.interactive && res.code == StatusCode.Accepted)
                    return;
                else if (res.code != StatusCode.Ok)
                    main.notify(res.message, LogType.Error);
                else {
                    $(".my-modal").modal('hide');
                    setTimeout(() => {
                        main.handleResponse(res);
                    }, 100);
                    //_.extend(glob.data, res.data);
                }
            }, (err) => {
                this.showProgress = false;
                main.notify(err);
            });
        }
    }
};
__decorate([
    Prop()
], Function.prototype, "title", void 0);
__decorate([
    Prop()
], Function.prototype, "name", void 0);
__decorate([
    Prop()
], Function.prototype, "data", void 0);
__decorate([
    Prop()
], Function.prototype, "styles", void 0);
Function = __decorate([
    Component
], Function);
export default Function;
//# sourceMappingURL=Function.vue.js.map