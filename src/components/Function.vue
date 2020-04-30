<script lang="ts">
    import {FunctionExecEventArg} from '@/types';
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {FunctionDec, LogType, StatusCode} from "../../../sys/src/types";
    import * as main from '../main';
    import {glob} from '@/main';

    @Component({name: 'Function'})
    export default class Function extends Vue {
        @Prop() private title: string;
        @Prop() private name: string;
        @Prop() private data: any;
        @Prop() private styles: string;
        private showProgress = false;
        private spinnerTimer = null;

        render(ce) {
            if (this.styles && this.styles.indexOf('fa-') > -1)
                return ce('div', [
                    ce('button', {
                        attrs: {"class": "btn"},
                        on: {click: this.click},
                    }, [
                        ce('i', {attrs: {"class": "fa " + this.styles}})
                    ])
                ]);
            else
                return ce('div', {attrs: {"class": "d-inline-block"}}, [
                    ce('button', {
                        attrs: {"class": 'btn ' + (this.styles || 'btn-primary m-1')},
                        on: {click: this.click},
                    }, [
                        ce('span', this.title),
                        ce('i', {attrs: {"class": `ml-2 fa fa-sync fa-spin wait-spinner ${(this.showProgress ? "" : "d-none")}`}})
                    ])
                ]);
        }

        validate(data) {
            let dec = main.getDec(data) as FunctionDec;
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

        @Emit('exec')
        emitExec(e: FunctionExecEventArg): FunctionExecEventArg {
            return e;
        }

        click(e) {
            this.showProgress = true;
            if (this.$listeners && this.$listeners.exec) {
                try {
                    let $this = this;
                    let arg: FunctionExecEventArg = {
                        name: this.name, event: e, data: this.$store.state.data, stopProgress() {
                            $this.showProgress = false;
                        }
                    };
                    this.$emit('exec', arg);
                } catch (ex) {
                    this.showProgress = false;
                    console.error(`function '${this.name}' click error.`, ex);
                }
            } else {
                let functionName = this.name;
                if (!this.data) throw `data must be set for 'Function' element '${functionName}'`;

                let dec = main.getDec(this.data) as FunctionDec;
                if (!this.validate(this.data)) return;

                main.log(`calling '${this.name}' ...`, this.data);
                main.ajax("/" + this.name, this.data, null, (res) => {
                    this.showProgress = false;
                    if (dec.interactive && res.code == StatusCode.Accepted)
                        return;
                    else if (res.code != StatusCode.Ok)
                        main.notify(res.message, LogType.Error);
                    else {
                        glob.modal = false;
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
    }
</script>
