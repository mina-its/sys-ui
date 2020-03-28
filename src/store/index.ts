import Vue from 'vue';
import Vuex from 'vuex';
import {AppState, AppStateCmenu, AppStateLog, MenuItem} from "@/types";

Vue.use(Vuex);

export default new Vuex.Store({
	state: new AppState(),
	getters: {
		toolbar(state: AppState): boolean {
			return state.form._.toolbar;
		},

		isDirty(state: AppState): boolean {
			return state.modifies.length > 0;
		}
	},
	mutations: {
		updateRoot(state: AppState, root: AppState) {
			Object.assign(state, root);
		},

		updateFileGallery(state: AppState, update: any) {
			Object.assign(state.fileGallery, update);
		},

		updateCMenu(state: AppState, cmenu: AppStateCmenu) {
			Object.assign(state.cmenu, cmenu);
		},

		updateCMenuItem(state: AppState, params: { update: MenuItem, index: number }) {
			Object.assign(state.cmenu.items[params.index], params.update);
		},

		pushLog(state: AppState, log: AppStateLog) {
			state.logs.push(log);
		},

		clearLogs(state: AppState) {
			state.logs = [];
		}
	},
	actions: {
		updateProp(state, update: { ref: string, prop: string, newValue: any }) {

		},

		insertItem(state, insert: { ref: string, item: any }) {

		},

		deleteItem(state, remove: { ref: string }) {

		},
	},
});
