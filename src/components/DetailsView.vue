<template>
    <div class="d-flex overflow-auto details-view" @scroll="onScroll()">
        <aside v-if="sideMenuVisible" class="border-right separator-line sidenav p-2 my-3 d-none d-md-block">
            <ul class="nav flex-column tree pr-5" id="menus">
                <li v-for="item in sideMenu" class="nav-item">
                    <a @click="selectGroup(item)"
                       :class="{'text-nowrap text-secondary nav-link': true, 'active': currentGroup==item.title}"
                       href="#">{{item.title}}</a>
                </li>
            </ul>
        </aside>
        <div :class="{'p-4':root, 'border rounded': !root && meta.detailsViewType==2}">
            <div v-if="groupVisible(group)" :class="{'py-4':meta.detailsViewType==2}" v-for="group in groups"
                 :id="'gp-' + group.replace(/\s/g, '-')">
                <h3 v-if="groupHeadVisible(group)" class="text-secondary mb-4">{{group}}</h3>
                <div class="group">
                    <prop v-for="prop in getProps(group)" :key="prop.name" :item="item" :meta="prop" @changed="changed"
                          :viewType="2"></prop>
                </div>
            </div>
            <prop v-if="nonGroupVisible()" v-for="prop in meta.properties" :key="prop.name" :item="item" :meta="prop"
                  @changed="changed" :viewType="2"></prop>
            <div v-if="root" class="h-25"></div>
        </div>
    </div>
</template>

<script lang="ts">
	import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
	import {ObjectViewType, ObjectDetailsViewType} from "../../../sys/src/types";
	import {ObjectMeta} from '../../../web/src/types';

	@Component
	export default class DetailsView extends Vue {
		@Prop() private uri: string;
		@Prop() private root: boolean;
		currentGroup: string;

		mounted() {
			if (this.root) {
				this.currentGroup = this.groups[0];
				let meta = st.meta[this.uri];
				st.headFuncs = [];
				if (meta.links)
					for (let link of meta.links) {
						st.headFuncs.push({title: link.title, name: link.address.$oid, exec: this.execLink});
					}
			}
		}

		@Watch('uri')
		onPropertyChanged(value: string, oldValue: string) {
			this.currentGroup = this.groups[0];
		}

		selectGroup(item) {
			this.currentGroup = item.title;
			let meta = this.meta as ObjectMeta;
			history.pushState(null, null, item.ref);
			if (meta.detailsViewType == ObjectDetailsViewType.Tabular) {
				let $dv = $(".details-view");
				$dv.animate({
						scrollTop: $(item.ref).offset().top + $dv.scrollTop() - $dv.offset().top
					}
					,
					0
				);
			}
		}

		nonGroupVisible() {
			return this.groups.length <= 1;
		}

		groupVisible(group) {
			if (this.groups.length <= 1) return false;
			let meta = this.meta as ObjectMeta;
			if (this.root)
				return meta.detailsViewType == ObjectDetailsViewType.Tabular || this.currentGroup == group;
			else
				return true;
		}

		groupHeadVisible(group) {
			let meta = this.meta as ObjectMeta;
			return this.root && meta.detailsViewType == ObjectDetailsViewType.Tabular;
		}

		onScroll() {
			main.hideCmenu();
		}

		execLink(cn: Context) {
			let data = {data: this.item};
			main.ajax("/" + cn.name, data, null, main.handleResponse, (err) => {
					main.notify(err);
				}
			);
		}

		changed(prop, instance, val) {
			st.dirty = true;
			main.checkPropDependencyOnChange(this.meta, prop, instance);
		}

		getProps(group: string) {
			return _.filter(this.meta.properties, (prop) => {
				if (prop.properties)
					return group == prop.title;
				else
					return prop.group == group;
			});
		}

		get sideMenuVisible() {
			let meta = this.meta as ObjectMeta;
			return this.sideMenu && this.root && (!meta.detailsViewType || meta.detailsViewType == ObjectDetailsViewType.Grouped || meta.detailsViewType == ObjectDetailsViewType.Tabular);
		}

		get sideMenu() {
			let menus = [];
			for (let grp of this.groups) {
				menus.push({ref: "#gp-" + grp.replace(/\s/g, "-"), title: grp});
			}
			if (menus.length <= 1) menus = null;
			return menus;
		}

		get meta() {
			return st.meta[this.uri];
		}

		get item() {
			return st.data[this.uri];
		}

		get groups() {
			let props = this.meta.properties.filter((p) => {
				return p.condition == null || main.evalExpression(this.item, p.condition);
			});
			return props.map((p) => {
				return p.group;
			}).filter(main.onlyUnique);
		}
	}
</script>

<style lang="scss">
    .details-view {
        scroll-behavior: smooth;
        min-width: 100%;

        label {
            color: theme-color("form-label");
            font-weight: 600;
        }

        input {
            border-color: theme-color("grid-border");
        }

        .active {
            font-weight: 500;
            background-color: #eee;
            border-left: 3px solid #999;
            margin-left: -3px;
        }
    }
</style>
