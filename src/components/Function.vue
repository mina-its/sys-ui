<script lang="ts">
    import {FunctionExecEventArg, QuestionOptions} from '../types';
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {FunctionDec, FunctionMode, LogType, StatusCode} from "../../../sys/src/types";
    import {$t, ajax, getDec, glob, handleResponse, notify, prepareServerUrl, question, setPropertyEmbeddedError} from '../main';

    declare const $: any;

    @Component({name: 'Function'})
    export default class Function extends Vue {
        @Prop() private title: string;
        @Prop() private name: string;
        @Prop() private data: any;
        @Prop() private styles: string;
        private showProgress = false;

        render(ce) {
            if (this.styles && this.styles.indexOf('fa-') > -1)
                return ce('div', [
                    ce('button', {
                        attrs: {"class": "btn"},
                        on: {click: this.click},
                    }, [
                        ce('i', {attrs: {"class": this.styles}})
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
            let dec = getDec(data) as FunctionDec;
            if (dec && dec.properties) {
                let requiredProps = dec.properties.filter(p => p.required);
                let error = "";
                for (const prop of requiredProps) {
                    if (data[prop.name] === null || data[prop.name] === "") {
                        error = error || `Field <strong>${prop.title}</strong> is required`;
                        setPropertyEmbeddedError(data, prop.name, `* mandatory`);
                    }
                }
                if (error) {
                    notify(error, LogType.Error);
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
            try {
                this.showProgress = true;
                if (this.$listeners && this.$listeners.exec) {
                    let $this = this;
                    let arg: FunctionExecEventArg = {
                        name: this.name, event: e, data: this["$store"].state.data, stopProgress() {
                            $this.showProgress = false;
                        }
                    };
                    this.$emit('exec', arg);
                } else {
                    let functionName = this.name;
                    if (!this.data) throw `data must be set for 'Function' element '${functionName}'`;

                    let dec = getDec(this.data) as FunctionDec;
                    if (!this.validate(this.data)) return;

                    console.log(`calling '${this.name}' ...`, this.data);
                    ajax(prepareServerUrl(this.name, true), this.data, null, (res) => {
                        this.showProgress = false;
                        if (dec.interactive && res.code == StatusCode.Accepted)
                            return;
                        else if (res.code != StatusCode.Ok)
                            notify(res.message, LogType.Error);
                        else {
                            glob.modal = false;
                            const dec = this.data._.dec as FunctionDec;

                            if (res.message && !res.redirect && dec.mode == FunctionMode.OpenPage)
                                // BID project, stateCreation function
                                question(null, res.message, [{title: $t("close"), ref: ""}], null, (ref: any) => {
                                    location.href = location.href;
                                });
                            else
                                setTimeout(() => {
                                    handleResponse(res);
                                }, 100);
                        }
                    }, (err) => {
                        this.showProgress = false;
                        notify(err);
                    });
                }
            } catch (ex) {
                this.showProgress = false;
                console.error(`function '${this.name}' click error.`, ex);
            } finally {
                this.showProgress = false;
            }
        }
    }
</script>
