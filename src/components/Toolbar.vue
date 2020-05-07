<template>
    <div v-if="alwaysVisible || glob.form.toolbar"
         :class="{'d-flex p-2 btn-toolbar separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}"
         role="toolbar" aria-label="Toolbar with button groups">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                <li v-for="item in glob.form.breadcrumb" class="breadcrumb-item">
                    <a :href="item.ref">{{item.title}}</a>
                    <i :class="{'fa':1 ,'fa-chevron-right ml-2':ltr, 'fa-chevron-left mr-2':rtl}"></i>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{glob.form.breadcrumbLast}}</li>
            </ol>
        </nav>
        <div v-if="glob.dirty" class="mx-2" role="group">
            <Function styles="btn-primary" @exec="apply" name="apply" :title="$t('apply')"></Function>
            <Function styles="btn-link" @exec="cancel" name="cancel" :title="$t('cancel')"></Function>
        </div>
        <div class="mr-auto"></div>
        <div class="mx-2" role="group">
            <Function v-for="func in glob.headFuncs" :key="func._id" styles="btn-primary" :name="func.name"
                      @exec="func.exec" :title="func.title"></Function>
            <Function v-if="glob.newItemButton" styles="btn-primary" @exec="newItem"
                      :title="glob.newItemButton"></Function>
        </div>
        <Function styles="text-secondary fa-cog fa-lg" name="clickTitlePin" @exec="clickTitlePin"></Function>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {$t, glob} from '@/main';
    import {Keys} from '../../../sys/src/types';
    import {Constants, FunctionExecEventArg, MenuItem} from '@/types';
    import * as main from '../main';

    @Component({name: 'Toolbar', components: {}})
    export default class Toolbar extends Vue {
        @Prop() private alwaysVisible: boolean;

        mounted() {
            window.addEventListener("keydown", (e: KeyboardEvent) => {
                if (e.ctrlKey && e.which == Keys.s) {
                    this.apply({});
                    e.preventDefault();
                }
            });
        }

        newItem() {
            main.load(location.pathname + '?n=1', true);
        }

        cancel(e: FunctionExecEventArg) {
            main.clearModifies();
            main.load(location.pathname, !!main.getQs(Constants.QUERY_NEW));
        }

        clickTitlePin(e: FunctionExecEventArg) {
            let items: MenuItem[] = [
                {ref: "export-excel", title: $t('export-excel')},
                {ref: "export-csv", title: $t('export-csv')},
                {ref: "export-pdf", title: $t('export-pdf')},
                {title: "-"},
                {ref: "import", title: $t('import')},
                {title: "-"},
                {ref: "print", title: $t('print')},
            ];
            main.showCmenu(null, items, e.event, (state, item: MenuItem) => {
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

        apply(e: FunctionExecEventArg) {
            glob.notify = null;
            if (!e.stopProgress) e.stopProgress = () => main.log('Apply done!');
            if (!main.validate(this.$store.state.data)) return e.stopProgress();
            // todo: if (main.getQs("n") == "true") return main.commitNewItem();
            main.dispatchRequestServerModify(this.$store, e.stopProgress);
        }

        // submitFile(modify: Modify, done) {
        // 	let files = [modify.file];
        // 	let modifies = glob.md.filter(md => md.ref == modify.ref);
        // 	for (const mod of modifies) {
        // 		files.push(mod.file);
        // 	}
        // 	glob.md = glob.md.filter(mod => mod.ref != modify.ref);
        // 	main.ajax(setQs('m', RequestMode.partial, false, "/" + modify.ref), modify.data, {files}, (res) => {
        // 		let propName = modify.ref.replace(/^.+\/(\w+)$/, "$1");
        // 		glob.od[modify.rootRef][propName] = glob.data[modify.rootRef][propName] = flat2recursive(res.data);
        // 		this.commitModify(done);
        // 	}, (err) => {
        // 		done(err);
        // 		main.notify(err);
        // 	});
        // }
    }
</script>

<style lang="scss">
    .toolbar {
        z-index: 1;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .3), 0 2px 6px 2px rgba(60, 64, 67, .15);
    }
</style>
