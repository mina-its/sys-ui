<template>
    <div v-if="alwaysVisible || st.toolbar" class="d-flex p-2 pl-4 btn-toolbar border-bottom separator-line"
         role="toolbar" aria-label="Toolbar with button groups">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                <li v-for="item in st.form.breadcrumb" class="breadcrumb-item">
                    <a :href="item.ref">{{item.title}}</a>
                    <i class="fa fa-chevron-right ml-1"></i>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{st.form.title}}</li>
            </ol>
        </nav>
        <div v-if="st.dirty" class="mx-2" role="group">
            <function styles="btn-primary" @exec="apply" name="apply" title="${$t('apply')}"></function>
            <function styles="btn-link" @exec="cancel" name="cancel" title="${$t('cancel')}"></function>
        </div>
        <div class="mr-auto"></div>
        <div class="mx-2" role="group">
            <function v-for="func in st.headFuncs" :key="func._id" styles="btn-primary" :name="func.name"
                      @exec="func.exec" :title="func.title"></function>
        </div>
        <function styles="text-secondary fa-cog fa-lg" name="clickTitlePin" @exec="clickTitlePin"></function>
    </div>
</template>

<script lang="ts">
	declare let DeepDiff, $: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {st, glob, prepareServerUrl, $t, flat2recursive} from "@/main";
	import {Keys, WebMethod, LogType} from '../../../sys/src/types';
	import {Modify, DiffKind} from '@/types';

	const main = require("./main");

	@Component
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
			let modify: Modify = glob.md.find(m => m.ref == itemRef);
			if (!modify) {
				modify = {type: WebMethod.patch, ref: itemRef, data: {_id: item._id}, item: item, rootRef: ref} as Modify;
				glob.md.push(modify);
			}

			let val = diff.rhs;
			if (path[path.length - 1] == "$oid") {
				path.pop();
				val = {"$oid": val};
			}
			if (path.length > 1 && typeof path[path.length - 1] == "number") {
				// case: remove first sub role, the second sub role is substituted.
				path.pop();
				modify.data[path.join('.')] = item[path.join('.')];
			} else
				modify.data[path.join('.')] = val;
		}

		findDiffOnInsert(itemRef: string, item: any, ref: string, data: any, diff: any, path: any[]) {
			if (path && path.length) { // Add to multiple value property
				if (path.length != 1)
					throw "findDiffOnInsert, Invalid diff path length!";

				let modify: Modify = glob.md.find(md => md.ref == itemRef);
				if (!modify) {
					modify = {type: WebMethod.patch, ref: itemRef, data: {_id: item._id}, item: data, rootRef: ref} as Modify;
					glob.md.push(modify);
				}
				modify.data[path.join('.')] = item[path.join('.')];
				return;
			}

			let newItem = {};
			diff.item.rhs.map((value, key) => {
				if (value !== null) {
					newItem[key] = value;
				}
			});

			glob.md.push({
				type: WebMethod.post,
				ref: itemRef,
				data: newItem,
				item: diff.item.rhs,
				rootRef: ref
			} as Modify);
		}

		findDiff(ref: string) {
			let data = st.data[ref];
			let od = glob.od[ref];

			if (Array.isArray(data)) {
				for (let item of data) {
					item._status = null;
				}
				for (let item of od) {
					item._status = null;
				}
			}

			let diffs = DeepDiff(od, data) || [];
			for (let diff of diffs) {
				let item, itemRef;
				let path = diff.path ? JSON.parse(JSON.stringify(diff.path)) : null; // case: when we delete two sub roles, path is shared between different diffs
				if (Array.isArray(data) && path && path.length > 0) {
					item = data[path[0]];
					path.shift();
					itemRef = `${ref}/${main.getBsonId(item)}`;
				} else {
					item = data;
					itemRef = ref;
				}

				switch (diff.kind) {
					case DiffKind.newlyAdded:
					case DiffKind.edited:
						this.findDiffOnEdit(itemRef, item, ref, data, diff, path);
						break;

					case DiffKind.deleted:
						break;

					case DiffKind.arrayChange: {
						this.findDiffOnInsert(itemRef, item, ref, data, diff, path);
						break;
					}
				}
			}
		}

		apply(cn?, done?) {
			st.notify = null;
			if (!done) done = () => {
				main.log('Apply done!');
			};
			if (!main.validate()) return done();

			if (main.getQs("n") == "true")
				return main.commitNewItem();
			else
				for (let ref in st.data) {
					this.findDiff(ref);
				}

			this.commitModify(done);
		}

		cancel() {
			st.dirty = false;
			if (main.getQs("n") == "true")
				location.href = location.pathname;
			else
				location.reload();
		}

		clickTitlePin() {
			console.log('clickTitlePin');
		}

		commitModify(done?) {
			if (glob.md.length == 0) {
				main.notify($t('saved'), LogType.Debug);
				st.dirty = false;
				return done();
			}

			let modify = glob.md.pop();
			//main.log(modify.type, modify.ref, modify.data);
			main.ajax(prepareServerUrl(modify.ref), modify.data, {method: modify.type}, (res) => {
				let od = glob.od[modify.rootRef];
				res.data = flat2recursive(res.data);

				if (modify.type === WebMethod.post || modify.type == WebMethod.patch) {
					_.assignIn(modify.item, res.data);
					if (modify.type === WebMethod.post) {
						od.push(JSON.parse(JSON.stringify(modify.item)));
					} else if (modify.rootRef) { // 'modify.rootRef' is empty when we already update the old data, such as document change
						let oldItem = Array.isArray(od) ? od.find(o => o._id == modify.data._id) : od;
						let data = st.data[modify.rootRef];
						let item = Array.isArray(od) ? od.find(o => o._id == modify.data._id) : od;
						if (!oldItem)
							throw `oldItem not found, ref: '${modify.ref}'`;
						_.assignIn(oldItem, res.data);
						this.fixOldItemUpdate(oldItem);
					}
				}

				if (res.redirect && glob.md.length == 0)
					return main.handleResponseRedirect(res);
				else
					this.commitModify(done);
			}, (err) => {
				done(err);
				main.notify(err);
			});
		}

		fixOldItemUpdate(target: any) {
			for (let key in target) {
				if (key.indexOf('.') > -1) {
					let val = target[key];
					delete target[key];

					let parts = key.split('.');
					let parent = target;
					for (let i = 0; i < parts.length - 1; i++) {
						let part = parts[i];
						parent = parent[part];
					}
					parent[parts[parts.length - 1]] = val;
				}
			}
		}

		// submitFile(modify: Modify, done) {
		// 	let files = [modify.file];
		// 	let modifies = _.filter(glob.md, {ref: modify.ref});
		// 	for (let mod of modifies) {
		// 		files.push(mod.file);
		// 	}
		// 	glob.md = glob.md.filter(mod => mod.ref != modify.ref);
		// 	main.ajax(setQs('m', RequestMode.partial, false, "/" + modify.ref), modify.data, {files}, (res) => {
		// 		let propName = modify.ref.replace(/^.+\/(\w+)$/, "$1");
		// 		glob.od[modify.rootRef][propName] = st.data[modify.rootRef][propName] = flat2recursive(res.data);
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
