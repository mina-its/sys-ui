let index = {
    // Vuex
    "Modify: Dispatch               ": _dispatchStoreModify,
    "Modify: Commits                ": _commitStoreChange,
    "Server: Dispatch Changes       ": _dispatchRequestServerModify,
    "Server: Commit Changes         ": _commitServerChangeResponse,
    // Vue
    "Registers Components           ": registerComponents,
    "Start Vue                      ": startVue,
    // Global
    "Load                           ": load,
    "Handle Response                ": handleResponse,
};
import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import $ from 'jquery';
import App from './App.vue';
import { Constants, Global, StateChangeType } from './types';
import { Keys, LogType, RequestMode, StatusCode, WebMethod } from '../../sys/src/types';
const axios = require('axios').default;
export let glob = new Global();
let store;
export function $t(text) {
    return typeof (text) == 'object' ? text[glob.config.locale] || Object.values(text)[0] : text;
    // if (text[pack + "." + key]) return text[pack + "." + key];
    //
    // console.warn(`Warning: text '${pack}.${key}' not found`);
    // return key.replace(/-/g, " ");
}
// export function getNavmenu(res: WebResponse) {
// 	let _navmenu = localStorage.getItem('_navmenu');
// 	// if (_navmenu)
// 	// 	dispatchState({navmenu : JSON.parse(_navmenu)});
// 	// else
// 	return res.navmenu;
// }
//
// export function setNavmenu() {
// 	let ref = location.pathname;
// 	let title = document.title;
// 	// if (glob.form.breadcrumb && glob.form.breadcrumb.length > 0) {
// 	// 	let rootref = glob.form.breadcrumb[0].ref;
// 	// 	let rootItem = glob.navmenu.filter(item => item.ref == rootref).pop();
// 	// 	if (!rootItem)
// 	// 		rootItem = {ref: rootref, title: glob.form.breadcrumb[0].title};
// 	//
// 	// 	dispatchState({navmenu : glob.navmenu.filter(item => item.ref != rootItem).slice(0, 3);
// 	// 	glob.navmenu.unshift(rootItem);
// 	// } else {
// 	//glob.navmenu = glob.navmenu.filter(item => item.ref != ref).slice(0, 8);
// 	//glob.navmenu.unshift({title, ref});
// 	//}
// 	localStorage.setItem('_navmenu', JSON.stringify(glob.config.navmenu));
// }
export function evalExpression($this, expression) {
    try {
        if (expression == null) {
            return null;
        }
        return eval(expression.replace(/\bthis\b/g, '$this'));
    }
    catch (ex) {
        console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
    }
}
function vueResetFormData(dataset) {
    if (!glob.form || !glob.form.declarations || !dataset)
        return;
    const setDataMeta = (item, dec) => {
        item._ = item._ || {};
        let meta = item._;
        meta.dec = dec;
        return meta;
    };
    for (let ref in dataset) {
        let data = dataset[ref];
        let dec = glob.form.declarations[ref];
        if (!data || !dec)
            continue;
        if (Array.isArray(data)) {
            data.forEach(item => {
                let meta = setDataMeta(item, dec);
                meta.marked = null;
            });
        }
        else
            setDataMeta(data, dec);
        for (const prop of dec.properties) {
            if (Array.isArray(data))
                data.forEach(item => setUndefinedToNull(item, prop));
            else
                setUndefinedToNull(data, prop);
        }
    }
}
function setUndefinedToNull(item, prop) {
    if (!item) {
        return;
    }
    if (item[prop.name] === undefined) {
        item[prop.name] = null;
    }
    if (prop.required) {
        setPropertyEmbeddedError(item, prop.name, null);
    } // to check later
}
// export function vueResetProperties(data: any, dec: ObjectDeclare | FunctionDeclare) {
//     data._ = data._ || {};
//     let meta = data._ as EntityMeta;
//     meta.dec = dec;
//     for (const prop of meta.dec.properties) {
//         setUndefinedToNull(data, prop);
//     }
// }
export function getMeta(data) {
    if (!data || !data._)
        return null;
    return data._;
}
export function getDec(data) {
    let meta = getMeta(data);
    return meta ? meta.dec : null;
}
function validateData(data, ref) {
    let meta = getMeta(data);
    let requiredProps = meta.dec.properties.filter(p => p.required);
    for (const prop of requiredProps) {
        if (data[prop.name] == null) {
            notify(`Property '${prop.name}' is required.`, LogType.Warning);
            // if (!Array.isArray(glob.glob.form.dataset[ref]))
            // 	data._error = `Property '${prop.name}' is required.`;
            return false;
        }
    }
    return true;
}
export function validate(dataset) {
    for (const ref in dataset) {
        if (Array.isArray(dataset[ref])) {
            for (const item of dataset[ref]) {
                if (!validateData(item, ref))
                    return false;
            }
        }
        else if (!validateData(dataset[ref], ref))
            return false;
    }
    return true;
}
export function someProps(prop) {
    return Array.isArray(prop.properties) && prop.properties.length;
}
export function commitNewItem() {
    // todo
    // let objectName = location.pathname.replace(/\//, '');
    // let data = glob.data[objectName];
    // if (data._id != -1) {
    // 	notify('Invalid state, please refresh and check if the item already has been added!', LogType.Error);
    // 	return;
    // }
    // for (const ref in glob.data) {
    // 	if (ref.indexOf(objectName + "/") == 0) {
    // 		data[ref.substr(objectName.length + 1)] = glob.data[ref];
    // 	}
    // }
    //
    // ajax(prepareServerUrl(objectName), data, null, (res) => {
    // 	commitStateRoot({dirty: false});
    // 	location.href = `/${objectName}/${res.data._id.$oid}`;
    // }, (err) => {
    // 	notify(err);
    // });
}
export function prepareServerUrl(ref) {
    ref = '/' + ref;
    let locale = getQs('e');
    if (locale) {
        ref += '?e=' + locale;
    }
    return ref;
}
export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
export function handleResponse(res) {
    res = flat2recursive(res);
    if (res.config)
        glob.config = res.config;
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, LogType.Info);
    else if (res.form) {
        // WARNING: never change these orders:
        glob.form = res.form;
        vueResetFormData(res.data);
        glob.data = res.data;
        store.state.data = res.data;
        document.title = glob.form.title;
        glob.headFuncs = [];
        $('.details-view').scrollTop(0);
    }
    else {
        notify("WHAT should I do now?", LogType.Warning);
        console.log(res);
    }
}
export function getPropTextValue(meta, data) {
    if (meta.formula)
        return evalExpression(this.doc, meta.formula);
    if (!data)
        throw 'prop-text doc is null!';
    let val = data[meta.name];
    if (val && typeof val == 'object') {
        let locale = getQs('e') || 'en';
        return val[locale];
    }
    else
        return val;
}
export function equalRef(ref1, ref2) {
    if (!ref1 && !ref2) {
        return true;
    }
    else if (!ref1 || !ref2) {
        return false;
    }
    else if (ref1.$oid) {
        return ref1.$oid == ref2.$oid;
    }
    else {
        return ref1 == ref2;
    }
}
export function getPropReferenceValue(prop, data) {
    if (!data)
        return '';
    let val = data[prop.name];
    if (!val)
        return '';
    if (prop.isList) {
        if (!Array.isArray(val))
            val = [val];
        let values = [];
        for (const valItem of val) {
            let item = prop._.items.find(i => equalRef(i.ref, valItem));
            if (!item)
                values.push('...');
            else
                values.push(item.title);
        }
        return values.join(', ');
    }
    else {
        let item = prop._.items.find(i => equalRef(i.ref, val));
        if (!item)
            return '...';
        return item.title;
    }
}
function refresh() {
    glob.dirty = false;
    location.reload();
}
export function handleResponseRedirect(res) {
    if (res.redirect == Constants.redirectBack) {
        window.history.back();
    }
    else if (res.redirect == Constants.redirectSelf) {
        refresh();
    }
    else if (!$.isEmptyObject(res.data)) {
        let form = '';
        $.each(res.data, function (key, value) {
            form += '<input type="hidden" name="' + key + '" value="' + value + '">';
        });
        $('<form action="' + res.redirect + '" method="POST">' + form + '</form>').appendTo('body').submit();
    }
    else {
        window.open(res.redirect, '_self'); // res.newWindow ? '_blank' : '_self'
    }
}
export function isRtl() {
    return $('body').attr('dir') == 'rtl';
}
export function showCmenu(state, items, event, handler) {
    if (!items || items.length == 0) {
        hideCmenu();
        return;
    }
    for (let item of items) {
        item.hover = item.hover || false;
    }
    if (!items.find(i => i.hover)) {
        if (!items[0].title) {
            items[0].hover = false;
            items[1].hover = true;
        }
        else {
            items[0].hover = true;
        }
    }
    glob.cmenu = { show: true, items, handler, state, top: 0, left: 0, right: 0, bottom: 0, event };
}
export function hideCmenu() {
    glob.cmenu.show = false;
}
export function handleCmenuKeys(e) {
    switch (e.which) {
        case Keys.tab:
        case Keys.esc:
            glob.cmenu.handler(glob.cmenu.state, null);
            hideCmenu();
            break;
        case Keys.enter: {
            let item = glob.cmenu.items.find(i => i.hover);
            if (item) {
                glob.cmenu.handler(glob.cmenu.state, item);
                hideCmenu();
            }
            break;
        }
        case Keys.down: {
            let item = glob.cmenu.items.find(i => i.hover);
            if (!item) {
                glob.cmenu.items[0].hover = true;
            }
            else {
                let index = glob.cmenu.items.indexOf(item);
                if (index < glob.cmenu.items.length - 1) {
                    glob.cmenu.items[index].hover = false;
                    glob.cmenu.items[index + 1].hover = true;
                }
            }
            break;
        }
        case Keys.up: {
            let item = glob.cmenu.items.find(i => i.hover);
            if (!item) {
                glob.cmenu.items[glob.cmenu.items.length - 1].hover = true;
            }
            else {
                let index = glob.cmenu.items.indexOf(item);
                if (index > 0) {
                    glob.cmenu.items[index].hover = false;
                    glob.cmenu.items[index - 1].hover = true;
                }
            }
            break;
        }
    }
}
export function getQs(key) {
    let search = location.search;
    let query = new URLSearchParams(search);
    return query.get(key);
}
export function setQs(key, value, fullPath, href) {
    let search, el;
    if (href) {
        el = document.createElement('a');
        el.href = href;
        search = el.search;
    }
    else {
        search = location.search;
    }
    let query = new URLSearchParams(search);
    if (value == null) {
        query.delete(key);
    }
    else {
        query.set(key, value.toString());
    }
    if (href) {
        return el.pathname + '?' + query;
    }
    else {
        return fullPath ? (location.pathname + '?' + query) : query.toString();
    }
}
export function checkPropDependencyOnChange(dec, prop, instance) {
    if (!instance)
        return;
    let dependents = dec.properties.filter(p => p.dependsOn == prop.name);
    for (const prop of dependents) {
        instance[prop.name] = null;
        if (prop._.items) {
            prop._.items = null;
            let data = { prop, instance };
            ajax('/getPropertyReferenceValues', data, null, res => prop._.items = res.data, err => notify(err));
        }
    }
}
function parse(str) {
    if (!str)
        return null;
    let flatJson = JSON.parse(str);
    return flat2recursive(flatJson);
}
export function flat2recursive(flatJson) {
    if (!flatJson)
        return flatJson;
    let keys = {};
    const findKeys = obj => {
        if (obj && obj._0) {
            keys[obj._0] = obj;
            delete obj._0;
        }
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                findKeys(obj[key]);
            }
        }
    };
    const seen = new WeakSet();
    const replaceRef = obj => {
        if (seen.has(obj)) {
            return;
        }
        seen.add(obj);
        for (const key in obj) {
            let val = obj[key];
            if (!val) {
                continue;
            }
            if (typeof val === 'object' && !val.$oid) {
                if (val._$ == '') {
                    obj[key] = flatJson;
                }
                else if (val._$) {
                    obj[key] = eval('flatJson' + val._$);
                }
                replaceRef(val);
            }
        }
    };
    delete flatJson._0;
    findKeys(flatJson);
    replaceRef(flatJson);
    return flatJson;
}
export function browseFile(fileBrowsed) {
    glob.fileGallery.fileBrowsed = fileBrowsed;
    $('#file-browse').val('').click();
}
export function refreshFileGallery(file, done) {
    openFileGallery(glob.fileGallery.drive, file, glob.fileGallery.path, glob.fileGallery.fixedPath, glob.fileGallery.fileSelectCallback, done);
}
export function openFileGallery(drive, file, path, fixedPath, fileSelectCallback, done) {
    glob.fileGallery = {
        list: [],
        loading: true,
        drive,
        file,
        path: path || '',
        fixedPath,
        selectable: true,
        fileSelectCallback: fileSelectCallback
    };
    $('#file-gallery').modal('show');
    ajax('/getFileGallery?m=1', { drive: drive._id, path }, {}, res => {
        glob.fileGallery.loading = false;
        glob.fileGallery.uri = res.data.uri;
        glob.fileGallery.list = res.data.list;
        glob.fileGallery.selected = glob.fileGallery.list.find(l => l.name === glob.fileGallery.file);
        if (done) {
            done();
        }
    });
}
export function component(name, props, params) {
    params.props = props;
    Vue.component(name, params);
}
export function log(...message) {
    console.log(message);
}
export function invoke(pack, name, args) {
    return false;
}
export function toFriendlyFileSizeString(size) {
    if (size < 1024) {
        return size + ' B';
    }
    else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
    }
    else {
        return (size / 1024 / 1024).toFixed(1) + ' MB';
    }
}
export function joinUri(...parts) {
    let uri = '';
    for (const part of parts) {
        uri += '/' + (part || '').replace(/^\//, '').replace(/\/$/, '');
    }
    return uri.substr(1);
}
export function notify(content, type, params) {
    if (!content) {
        return;
    }
    const message = typeof content === 'string' ? content : content.message;
    if (!type) {
        if (typeof content !== 'string') {
            type = content.code && content.code !== StatusCode.Ok ? LogType.Error : LogType.Info;
        }
        else {
            type = LogType.Info;
        }
    }
    window.dispatchEvent(new CustomEvent(Constants.notifyEvent, { detail: { message, type } }));
}
export function question(questionId, message, options, select) {
    window.dispatchEvent(new CustomEvent(Constants.questionEvent, { detail: { questionId, message, options, select } }));
    $('#question-box').modal('show');
}
export function getBsonId(item) {
    if (!item) {
        throw 'Item is null';
    }
    else if (!item._id) {
        console.error('Invalid item data, _id is expected:', item);
        notify('Invalid data, please check the logs!');
        return null;
    }
    else {
        return item._id.$oid;
    }
}
export function head_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
}
export function body_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
}
export function del_script(src) {
    const el = document.querySelector('script[src=\'' + src + '\']');
    if (el) {
        el.remove();
    }
}
export function head_link(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
}
export function body_link(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.body.appendChild(link);
}
export function del_link(href) {
    const el = document.querySelector('link[href="' + href + '"]');
    if (el) {
        el.remove();
    }
}
export function setPropertyEmbeddedError(doc, propName, error) {
    console.assert(doc, `setPropertyEmbeddedError doc is empty, prop:${propName}!`);
    doc._ = doc._ || {};
    doc._[propName] = doc._[propName] || {};
    doc._[propName].err = error;
}
export function load(href) {
    if (glob.dirty) {
        notify($t('save-before'), LogType.Warning);
        return;
    }
    ajax(setQs('m', RequestMode.inline, false, href), null, null, handleResponse, err => notify(err));
}
export function ajax(url, data, config, done, fail) {
    let headers = {};
    if (glob.config.host) {
        url = joinUri(glob.config.host, url);
    }
    let params = { url, data, headers, withCredentials: true };
    if (config && config.method) {
        params.method = config.method;
    }
    else {
        params.method = data ? WebMethod.post : WebMethod.get;
    }
    if (data && data._files) {
        params.data = new FormData();
        for (const file of data._files) {
            params.data.append('files[]', file, file['name']);
        }
        params.data.append('data', JSON.stringify(data));
        params.headers['Content-Type'] = 'multipart/form-data';
    }
    fail = fail || notify;
    console.log(params);
    axios(params).then(res => {
        if (res.code && res.code !== StatusCode.Ok) {
            fail({ code: res.code, message: res.message });
        }
        else {
            try {
                done(res.data);
            }
            catch (ex) {
                notify(`error on handling ajax response: ${ex.message}`);
                console.error(res, ex);
            }
        }
    }).catch(err => {
        console.error(`error on ajax '${url}'`, err);
        if (err.response && err.response.data && err.response.data.message) {
            fail({ message: err.response.data.message, code: err.response.data.code });
        }
        else if (err.response && err.response.data) {
            fail({ message: err.response.data, code: err.response.status });
        }
        else {
            fail({ message: err.toString(), code: StatusCode.UnknownError });
        }
    });
}
function registerComponents() {
    Vue.component('Function', require("@/components/Function.vue").default);
    Vue.component('Panel', require("@/components/Panel.vue").default);
    Vue.component('Modal', require("@/components/Modal.vue").default);
    Vue.component('Prop', require("@/components/Prop.vue").default);
    Vue.component('ObjectView', require("@/components/ObjectView.vue").default);
    Vue.component('FormElem', require("@/components/ObjectView.vue").default);
    Vue.component('GridView', require("@/components/GridView.vue").default);
    Vue.component('DetailsView', require("@/components/DetailsView.vue").default);
    Vue.component('CheckBox', require("@/components/CheckBox.vue").default);
}
function startVue(res) {
    Vue.use(Vuex);
    store = createStore();
    handleResponse(res);
    Object.assign(Vue.config, { productionTip: false, devtools: true });
    Vue.prototype.glob = glob;
    Vue.prototype.$t = $t;
    Vue.directive('focus', {
        inserted(el, binding) {
            if (binding.value)
                el.focus();
        }
    });
    registerComponents();
    new Vue({ data: glob, store, render: h => h(App) }).$mount('#app');
}
export function commitStoreChange(store, change) {
    store.commit('_commitStoreChange', change);
}
function _commitStoreChange(state, change) {
    let ref = change.uri;
    glob.dirty = true;
    switch (change.type) {
        case StateChangeType.Patch:
            change.item[change.prop] = change.value;
            break;
        case StateChangeType.Insert:
            state.data[ref].push(change.item);
            break;
        case StateChangeType.Delete:
            state.data[ref].splice(state.data[ref].indexOf(change.item), 1);
            break;
    }
    change.vue.$forceUpdate();
}
export function commitServerChangeResponse(store, modify, res) {
    store.commit('_commitServerChangeResponse', { modify, res });
}
function _commitServerChangeResponse(store, arg) {
    switch (arg.modify.type) {
        case WebMethod.patch:
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            break;
        case WebMethod.post:
            if (arg.modify.state._id != arg.res._reqId)
                notify(`data save error: state id '${arg.modify.state._id}' and request id '${arg.res._reqId}' are not same`, LogType.Error);
            else
                delete arg.res._reqId;
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            //Object.assign(arg.modify.state, arg.res);
            break;
    }
}
export function dispatchStoreModify(vue, change) {
    vue.$store.dispatch('_dispatchStoreModify', change);
}
function _dispatchStoreModify(store, change) {
    let ref = change.uri;
    switch (change.type) {
        case StateChangeType.Patch: {
            let modify = glob.modifies.find(m => m.ref === ref && m.type == WebMethod.post);
            if (!modify) {
                ref = ref + "/" + getBsonId(change.item);
                modify = glob.modifies.find(m => m.ref === ref);
                if (!modify) {
                    modify = { ref, type: WebMethod.patch, data: {}, state: change.item };
                    glob.modifies.push(modify);
                }
            }
            modify.data[change.prop] = change.value;
            break;
        }
        case StateChangeType.Insert: {
            let data = { _id: change.item._id };
            if (change.item._z)
                data["_z"] = change.item._z;
            glob.modifies.push({ ref, type: WebMethod.post, data, state: change.item });
            break;
        }
        case StateChangeType.Delete: {
            ref = ref + "/" + getBsonId(change.item);
            let modify = glob.modifies.find(m => m.ref === ref);
            if (modify)
                glob.modifies.splice(glob.modifies.indexOf(modify), 1);
            else
                glob.modifies.push({ state: change.item, ref, type: WebMethod.del });
            break;
        }
    }
    commitStoreChange(store, change);
}
export function dispatchRequestServerModify(store, done) {
    store.dispatch('_dispatchRequestServerModify', done);
}
function _dispatchRequestServerModify(store, done) {
    if (glob.modifies.length == 0) {
        notify($t('saved'), LogType.Debug);
        glob.dirty = false;
        return done();
    }
    let modify = glob.modifies.shift();
    //main.log(modify.type, modify.ref, modify.data);
    ajax(prepareServerUrl(modify.ref), modify.data, { method: modify.type }, (res) => {
        res.data = flat2recursive(res.data);
        commitServerChangeResponse(store, modify, res.data);
        if (res.redirect && glob.modifies.length == 0)
            return handleResponseRedirect(res);
        else
            dispatchRequestServerModify(store, done);
    }, (err) => {
        done(err);
        notify(err);
    });
}
function createStore() {
    return new Store({
        mutations: {
            _commitStoreChange,
            _commitServerChangeResponse
        },
        actions: {
            _dispatchStoreModify,
            _dispatchRequestServerModify,
        }
    });
}
function start() {
    console.log('starting ...');
    const mainState = $('#main-state').html();
    const res = parse(mainState);
    if (res)
        startVue(res);
    else { // load main-state async
        let host = "http://localhost";
        let uri = host + setQs('m', RequestMode.inlineDev, true) + location.hash;
        //console.log(uri);
        axios.get(uri, { withCredentials: true }).then(res => {
            if (res.data)
                startVue(res.data);
            else
                console.error(res);
        }).catch(err => console.error(err));
    }
}
start();
//# sourceMappingURL=main.js.map