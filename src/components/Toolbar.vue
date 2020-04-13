<template>
    <div v-if="alwaysVisible || glob.form.toolbar"
         class="d-flex p-2 pl-4 btn-toolbar separator-line toolbar"
         role="toolbar" aria-label="Toolbar with button groups">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                <li v-for="item in glob.form.breadcrumb" class="breadcrumb-item">
                    <a :href="item.ref">{{item.title}}</a>
                    <i class="fa fa-chevron-right ml-2"></i>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{glob.form.title}}</li>
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
        </div>
        <Function styles="text-secondary fa-cog fa-lg" name="clickTitlePin" @exec="clickTitlePin"></Function>
    </div>
</template>

<script lang="ts">
    import Function from "@/components/Function.vue";
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {glob} from '../main';
    import {Keys} from '../../../sys/src/types';
    import {FunctionExecEventArg} from '../types';
    import * as main from '../main';

    @Component({components: {Function}})
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

        cancel(e: FunctionExecEventArg) {
            glob.dirty = false;
            if (main.getQs("n") == "true")
                location.href = location.pathname;
            else {
                main.load(location.pathname);
            }
        }

        clickTitlePin(e: FunctionExecEventArg) {
            console.log('clickTitlePin');
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
