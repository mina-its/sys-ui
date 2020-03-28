import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		item: {name: 'Farhad'},
	},
	mutations: {},
	actions: {
		patchItem(context, item: any) {
			Object.assign(this.state.item, item);
		},
	},
	modules: {},
});
