<template>
    <div v-if="alwaysVisible || glob.form._.toolbar" class="d-flex p-2 pl-4 btn-toolbar border-bottom separator-line"
         role="toolbar" aria-label="Toolbar with button groups">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                <li v-for="item in glob.form.breadcrumb" class="breadcrumb-item">
                    <a :href="item.ref">{{item.title}}</a>
                    <i class="fa fa-chevron-right ml-1"></i>
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
	declare let $: any;
	import Function from "@/components/Function.vue";
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {prepareServerUrl, $t, flat2recursive, glob} from "@/main";
	import {Keys, WebMethod, LogType} from '../../../sys/src/types';

	const main = require("./main");

	@Component({components: {Function}})
	export default class Toolbar extends Vue {
		@Prop() private alwaysVisible: boolean;

		mounted() {
			$(window).on("keydown", (e) => {
				if (e.ctrlKey && e.which == Keys.s) {
					this.apply();
					return false;
				}
			});
		}

		del() {

		}

		findDiffOnEdit(itemRef: string, item: any, ref: string, data: any, diff: any, path: any[]) {
			// todo
			// let modify: Modify = glob.md.find(m => m.ref == itemRef);
			// if (!modify) {
			// 	modify = {type: WebMethod.patch, ref: itemRef, data: {_id: item._id}, item: item, rootRef: ref} as Modify;
			// 	glob.md.push(modify);
			// }
			//
			// let val = diff.rhs;
			// if (path[path.length - 1] == "$oid") {
			// 	path.pop();
			// 	val = {"$oid": val};
			// }
			// if (path.length > 1 && typeof path[path.length - 1] == "number") {
			// 	// case: remove first sub role, the second sub role is substituted.
			// 	path.pop();
			// 	modify.data[path.join('.')] = item[path.join('.')];
			// } else
			// 	modify.data[path.join('.')] = val;
		}

		findDiffOnInsert(itemRef: string, item: any, ref: string, data: any, diff: any, path: any[]) {
			// todo
			// if (path && path.length) { // Add to multiple value property
			// 	if (path.length != 1)
			// 		throw "findDiffOnInsert, Invalid diff path length!";
			//
			// 	let modify: Modify = glob.md.find(md => md.ref == itemRef);
			// 	if (!modify) {
			// 		modify = {type: WebMethod.patch, ref: itemRef, data: {_id: item._id}, item: data, rootRef: ref} as Modify;
			// 		glob.md.push(modify);
			// 	}
			// 	modify.data[path.join('.')] = item[path.join('.')];
			// 	return;
			// }
			//
			// let newItem = {};
			// diff.item.rhs.map((value, key) => {
			// 	if (value !== null) {
			// 		newItem[key] = value;
			// 	}
			// });
			//
			// glob.md.push({
			// 	type: WebMethod.post,
			// 	ref: itemRef,
			// 	data: newItem,
			// 	item: diff.item.rhs,
			// 	rootRef: ref
			// } as Modify);
		}

		// findDiff(ref: string) {
		// 	let data = glob.data[ref];
		// 	let od = glob.od[ref];
		//
		// 	if (Array.isArray(data)) {
		// 		for (const item of data) {
		// 			item._status = null;
		// 		}
		// 		for (const item of od) {
		// 			item._status = null;
		// 		}
		// 	}
		//
		// 	let diffs = DeepDiff(od, data) || [];
		// 	for (const diff of diffs) {
		// 		let item, itemRef;
		// 		let path = diff.path ? JSON.parse(JSON.stringify(diff.path)) : null; // case: when we delete two sub roles, path is shared between different diffs
		// 		if (Array.isArray(data) && path && path.length > 0) {
		// 			item = data[path[0]];
		// 			path.shift();
		// 			itemRef = `${ref}/${main.getBsonId(item)}`;
		// 		} else {
		// 			item = data;
		// 			itemRef = ref;
		// 		}
		//
		// 		switch (diff.kind) {
		// 			case DiffKind.newlyAdded:
		// 			case DiffKind.edited:
		// 				this.findDiffOnEdit(itemRef, item, ref, data, diff, path);
		// 				break;
		//
		// 			case DiffKind.deleted:
		// 				break;
		//
		// 			case DiffKind.arrayChange: {
		// 				this.findDiffOnInsert(itemRef, item, ref, data, diff, path);
		// 				break;
		// 			}
		// 		}
		// 	}
		// }

		apply(cn?, done?) {
			main.updateStateRoot({notify: null});
			if (!done) done = () => {
				main.log('Apply done!');
			};
			if (!main.validate()) return done();

			if (main.getQs("n") == "true")
				return main.commitNewItem();
			// else
			// 	for (const ref in glob.data) {
			// 		this.findDiff(ref);
			// 	}

			this.commitModify(done);
		}

		cancel() {
			glob.dirty = false;
			if (main.getQs("n") == "true")
				location.href = location.pathname;
			else
				location.reload();
		}

		clickTitlePin() {
			console.log('clickTitlePin');
		}

		commitModify(done?) {
			if (glob.modifies.length == 0) {
				main.notify($t('saved'), LogType.Debug);
				glob.dirty = false;
				return done();
			}

			let modify = glob.modifies.pop();
			//main.log(modify.type, modify.ref, modify.data);
			main.ajax(prepareServerUrl(modify.ref), modify.data, {method: modify.type}, (res) => {
				res.data = flat2recursive(res.data);

				if (modify.type === WebMethod.post || modify.type == WebMethod.patch)
					Object.assign(modify.data, res.data);

				if (res.redirect && glob.modifies.length == 0)
					return main.handleResponseRedirect(res);
				else
					this.commitModify(done);
			}, (err) => {
				done(err);
				main.notify(err);
			});
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

<style scoped lang="scss">

</style>
