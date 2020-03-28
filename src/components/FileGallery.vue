<template>
    <div id="file-gallery" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content" @contextmenu="openRootMenu">
                <div class="modal-header" v-if="glob.fileGallery.drive">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb pt-2 p-0 m-0 bg-transparent">
                            <li v-for="item in breadcrumb" class="breadcrumb-item">
                                <a @click="browse(item.ref)" href="#">{{item.title}}</a>
                                <i class="fa fa-chevron-right ml-1"></i>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{current}}</li>
                        </ol>
                    </nav>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex flex-wrap p-3">
                        <transition name="fade">
                            <div v-if="glob.fileGallery.loading" class="file-gallery-waiting"><i
                                    class="fa text-secondary fa-spin fa-refresh fa-lg"></i><span
                                    class="p-2">loading ...</span></div>
                        </transition>
                        <div v-for="item of files" @dblclick="select(null, null, item)"
                             class="file-gallery-item m-1 p-1" tabindex="1" @focus="focus(item)"
                             @contextmenu="openMenu($event, item)" v-focus="isSelected(item)">
                            <div class="gallery-item-file d-flex align-items-center justify-content-center">
                                <img :class="imageStyle(item)" :src="icon(item)"/>
                            </div>
                            <label class="text-center w-100 file-gallery-label">{{item.name}}<span
                                    class="file-gallery-size">{{size(item)}}</span></label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="d-flex w-100">
                        <Function v-if="glob.fileGallery.selectable" styles="m-2 btn-primary" @exec="select"
                                  title="${$t('select')}"></Function>
                        <Function styles="m-2 btn-secondary" @exec="close" title="${$t('close')}"></Function>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
	import Function from "@/components/Function.vue";

	declare let $: any;
	import {Component, Prop, Vue} from 'vue-property-decorator';
	import {glob, $t} from '@/main';
	import {DirFile, LogType, DirFileType, YesNo, Pair} from '../../../sys/src/types';
	import {MenuItem} from '@/types';

	const main = require("./main");
	@Component({components: {Function}})
	export default class FileGallery extends Vue {
		isSelected(item: DirFile) {
			return glob.fileGallery.selected == item;
		}

		openRootMenu(e) {
			let items: MenuItem[] = [
				{ref: "upload", title: $t('upload')},
				{title: "-"},
				{ref: "refresh", title: $t('refresh')}
			];
			main.showCmenu(null, items, e, (state, item: MenuItem) => {
				switch (item.ref) {
					case "upload":
						main.browseFile((files) => {
							main.ajax('/uploadToFileGallery?m=1', {
									_files: files,
									drive: glob.fileGallery.drive._id,
									path: glob.fileGallery.path
								}, null, res => {
									main.refreshFileGallery();
									main.notify('upload done!', LogType.Debug);
								}
							)
							;
						});
						break;

					case "refresh":
						main.refreshFileGallery();
						break;
				}
			});
			e.preventDefault();
		}

		openMenu(e, item: DirFile) {
			if (item.type == DirFileType.Folder) return;

			let items: MenuItem[] = [
				{ref: "preview", title: $t('preview')},
				{ref: "download", title: $t('download')},
				// {ref: "rename", title: $t('rename')},
				{title: "-"},
				{ref: "remove", title: $t('remove')},
				{title: "-"},
				{ref: "refresh", title: $t('refresh')}
			];
			main.showCmenu(item, items, e, (state, menu: MenuItem) => {
					switch (menu.ref) {
						case "remove":
							main.question(null, `### Delete Confirm\n\nAre you sure you want to delete the file '${item.name}'`, [{
								title: "YES",
								ref: YesNo.Yes
							}, {
								title: "NO",
								ref: YesNo.No
							}], (option: Pair) => {
								if (!option || option.ref == YesNo.No) return;
								main.ajax("/deleteFromFileGallery?m=1", {
									drive: glob.fileGallery.drive._id,
									pth: glob.fileGallery.path,
									name: item.name
								}, null, () => {
									main.refreshFileGallery();
								});
							});
							break;
						case "preview":
						case "download":
							window.open(main.joinUri(glob.fileGallery.uri, item.name), '_blank');
							break;

						case "refresh":
							main.refreshFileGallery();
							break;

						case "rename":
							item["editing"] = true;
							console.log(item);
							break;
					}
				}
			)
			;
			e.stopPropagation();
			e.preventDefault();
		}

		imageStyle(item: DirFile) {
			let ext = item.name.split('.').pop().toLowerCase();
			switch (ext) {
				case "png":
				case "jpg":
				case "jpeg":
				case "gif":
				case "tiff":
				case "ico":
					return "file-gallery-image-src";
				default:
					return null;
			}
		}

		size(item: DirFile) {
			return item.size ? "(" + main.toFriendlyFileSizeString(item.size) + ")" : "";
		}

		icon(item: DirFile) {
			if (item.type == DirFileType.Folder)
				return '/images/gallery/folder2.png';

			let ext = item.name.split('.').pop().toLowerCase();
			switch (ext) {
				case "png":
				case "jpg":
				case "jpeg":
				case "gif":
				case "tiff":
				case "ico":
					return main.joinUri(glob.fileGallery.uri, item.name);

				case "doc":
				case "docx":
					return '/images/gallery/doc.png';

				case "exe":
					return '/images/gallery/exe.png';

				case "mp3":
				case "wav":
					return '/images/gallery/music.png';

				case "pdf":
					return '/images/gallery/pdf.png';

				case "avi":
				case "mp4":
				case "mov":
					return '/images/gallery/play.png';

				case "zip":
					return '/images/gallery/zip.png';

				case "xml":
					return '/images/gallery/xml.png';

				default:
					return '/images/gallery/file.png';
			}
		}

		browse(ref: string) {
			if (!glob.fileGallery.fixedPath) {
				glob.fileGallery.path = ref;
				main.refreshFileGallery();
			} else
				main.notify("Current directory Can not be changed!", LogType.Debug);
		}

		select(cn, done, item: DirFile) {
			if (item)
				glob.fileGallery.selected = item;
			if (glob.fileGallery.selected && glob.fileGallery.selected.type == DirFileType.Folder) {
				glob.fileGallery.path = main.joinUri(glob.fileGallery.path, glob.fileGallery.selected.name);
				main.refreshFileGallery(null, done);
			} else {
				$("#file-gallery").modal('hide');
				glob.fileGallery.fileSelectCallback(glob.fileGallery.path, glob.fileGallery.selected);
				if (done) done();
			}
		}

		close(cn, done) {
			$("#file-gallery").modal('hide');
			done();
		}

		focus(item: DirFile) {
			glob.fileGallery.selected = item;
		}

		get breadcrumb() {
			if (glob.fileGallery.fixedPath)
				return [];
			let parts = glob.fileGallery.path.split("/").filter(el => el);
			let result: Pair[] = [];
			parts.forEach((part, i) => {
				result.push({title: part, ref: ""});
			});

			if (result.length > 0)
				result.unshift({title: main.getText(glob.fileGallery.drive.title), ref: ""});
			result.pop();
			return result;
		}

		get files() {
			if (glob.fileGallery.fixedPath)
				glob.fileGallery.list = glob.fileGallery.list.filter(f => f.type == DirFileType.File);
			glob.fileGallery.list.sort((a, b) => b.type - a.type);
			glob.fileGallery.list.forEach(i => i["editing"] = false);
			return glob.fileGallery.list;
		}

		get current() {
			if (glob.fileGallery.fixedPath) {
				return main.getText(glob.fileGallery.drive.title) + ` (${glob.fileGallery.path})`;
			} else {
				let parts = glob.fileGallery.path.split("/").filter(el => el);
				if (parts.length == 0) return main.getText(glob.fileGallery.drive.title);
				return parts.pop();
			}
		}
	}
</script>

<style lang="scss">
    #file-gallery {
        .gallery-item-file {
            width: 100%;
            height: 128px;
        }

        .modal-body {
            height: 400px;
            max-height: 400px;
            overflow-y: auto;
        }

        .modal-footer {
            justify-content: flex-start;
        }

        .file-gallery- {
            &label {
                word-break: break-all;
                font-size: small;
            }

            &waiting {
                position: absolute;;
            }

            &item {
                width: 128px;

                &:hover {
                    background-color: #E5F3FF;
                }

                &:focus {
                    background-color: #DEF;
                    outline: 1px solid #CDF;
                    font-weight: 500;
                }
            }

            &image-src {
                box-shadow: 1px 1px 3px #999;
                max-width: 128px;
                max-height: 128px;
            }

            &size {
                color: gray;
                font-size: smaller;
                border-radius: 3px;
                padding: 0 3px;
                white-space: pre;
            }
        }
    }
</style>
