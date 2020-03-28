import Vue from 'vue';
import Vuex from 'vuex';
import { AppState } from "@/types";
Vue.use(Vuex);
export default new Vuex.Store({
    state: new AppState(),
    getters: {
        toolbar(state) {
            return state.form._.toolbar;
        },
        isDirty(state) {
            return state.modifies.length > 0;
        }
    },
    mutations: {
        updateRoot(state, root) {
            Object.assign(state, root);
        },
        updateFileGallery(state, update) {
            Object.assign(state.fileGallery, update);
        },
        updateCMenu(state, cmenu) {
            Object.assign(state.cmenu, cmenu);
        },
        updateCMenuItem(state, params) {
            Object.assign(state.cmenu.items[params.index], params.update);
        },
        pushLog(state, log) {
            state.logs.push(log);
        },
        clearLogs(state) {
            state.logs = [];
        }
    },
    actions: {
        updateProp(state, update) {
        },
        insertItem(state, insert) {
        },
        deleteItem(state, remove) {
        },
    },
});
//# sourceMappingURL=index.js.map