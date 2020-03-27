<template>
    <div :class="'p-0 border-0 ' + styles">
        <div v-if="viewType==2" class="prop-file-box">
            <div v-for="file in files">
                <div @click="showMenu(file, $event)" style="cursor: pointer"
                     class="prop-file-item d-flex px-2 py-1 mb-2 border border-bottom"><span class="flex-grow-1">{{title(file)}}</span><span
                        class="property-file-size text-secondary text-nowrap mx-2">{{size(file)}}</span>
                    <i @click="remove(file, $event)" class="text-black-50 fa fa-times float-right p-1 fa-xs"
                       style="cursor:pointer"></i>
                </div>
                <div v-if="meta.file && meta.file.preview && file._" class="prop-file-preview">
                    <img ref="preview" class="border" :src="file._.uri" @load="getInfo"/>
                    <div v-if="info">{{info}}</div>
                </div>
            </div>
            <function v-if="showBrowseButton" title="Browse file ..." styles="btn-secondary border"
                      @exec="browseFile"></function>
        </div>
        <div v-else :class="'p-1 '+(viewType==3 ? 'd-inline-block': '')" v-for="file in files">{{title(file)}}<span
                class="text-secondary mx-2">{{size(file)}}</span></div>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {ObjectViewType, Property} from "../../../sys/src/types";

	@Component
	export default class PropFile extends Vue {
		@Prop() private meta: Property;
		@Prop() private doc: any;
		@Prop() private viewType: any;
		@Prop() private styles: string;

		private info: string;

		showMenu(file, e) {
			if (prop(this).file && prop(this).file.drive) {
				let items: MenuItem[] = [
					{ref: "select", title: $t('select')},
					{ref: "download", title: $t('download')},
				];
				main.showCmenu(file, items, e, this.selectMenu);
			}
		}

		selectMenu(file: File, item) {
			main.hideCmenu();
			if (!item) return;
			switch (item.ref) {
				case "download":
					window.open(file._.uri + `?m=${RequestMode.download}`, '_blank');
					break;
				case "select":
					let val = this.doc[prop(this).name] as File;
					let path = val && val.path ? val.path : prop(this).file.path;
					main.openFileGallery(prop(this).file.drive, val ? val.name : null, path, !!prop(this).file.path, this.fileSelect);
					break;
			}
		}

		fileSelect(path: string, item: DirFile) {
			let val = this.doc[prop(this).name];
			let uri = `http://${sys.joinUri(prop(this).file.drive.uri, path, item.name)}`;
			let newItem = {_id: -Math.random(), name: item.name, path, _: {uri}, size: item.size};
			if (Array.isArray(val))
				val.push(newItem);
			else
				val = newItem;
			this.doc[prop(this).name] = val;
			st.dirty = true;
		}

		browseFile(cn, done) {
			let item = this.doc;
			if (prop(this).file && prop(this).file.drive && prop(this).file.drive.mode == DriveMode.Gallery) {
				let val = item[prop(this).name] as File;
				let path = val && val.path ? val.path : prop(this).file.path;
				main.openFileGallery(prop(this).file.drive, val ? val.name : null, path, !!prop(this).file.path, this.fileSelect, done);
			} else {
				main.browseFile((files) => {
					done();
					if (!files.length) return;
					item._files = item._files || [];
					for (let file of files) {
						item._files.push(file);
					}
					if (prop(this).file && prop(this).file.sizeLimit) {
						if (files.find(file => file.size > prop(this).file.sizeLimit)) {
							sys.notify(`File size must be less than ${prop(this).file.sizeLimit}`, LogType.Error);
							return;
						}
					}

					let val = item[prop(this).name];
					if (prop(this).isList) {
						if (!val) val = [];
						else if (!Array.isArray(val)) val = [val]; // in case of set property to multiple which already has data
					}

					for (let file of files) {
						let newItem = {_id: -Math.random(), name: file.name, size: file.size};
						if (Array.isArray(val))
							val.push(newItem);
						else
							val = newItem;
					}
					item[prop(this).name] = val;

					if (st.toolbar) {
						let rootRef = prop(this)._.ref.replace(/\/\w+$/, "");
						glob.md.push({ref: prop(this)._.ref, data: val, rootRef} as Modify);

						// replace od to prevent parallel modify detection
						if (rootRef)
							glob.od[rootRef][prop(this).name] = val;

						st.dirty = true;
					}
				});
			}
		}

		remove(file, e) {
			glob.md = glob.md.filter((mod) => {
				return mod.data._id != file._id
			});

			let val = this.doc[prop(this).name];
			if (Array.isArray(val)) {
				val = val.filter((item) => {
					return item._id != file._id;
				});
				if (val.length == 0)
					val = null;
			} else
				val = null;
			this.doc[prop(this).name] = val;
			st.dirty = true;
			console.log(1);
			e.stopPropagation();
		}

		size(file) {
			if (file.size)
				return "(" + sys.toFriendlyFileSizeString(file.size) + ")";
			else
				return null;
		}

		title(file) {
			return file.path ? sys.joinUri(file.path, file.name) : file.name;
		}

		getInfo() {
			if (this.$refs.preview && this.$refs.preview[0] && this.$refs.preview[0].naturalWidth)
				this.info = this.$refs.preview[0].naturalWidth + " x " + this.$refs.preview[0].naturalHeight;
		}

		get showBrowseButton() {
			return !this.files || prop(this).isList || !prop(this).file;
		}

		get files() {
			let val = this.doc[prop(this).name];
			if (!val || val.length == 0)
				return null;

			if (!Array.isArray(val))
				val = [val];

			return val;
		}

		get allowUpload() {
			return !this.files || prop(this).isList;
		}
	}
</script>

<style scoped lang="scss">

</style>
