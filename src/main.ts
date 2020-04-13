let index = {
    // Vuex
    "Modify                         ": dispatchStoreModify,
    "Server: Dispatch Changes       ": dispatchRequestServerModify,
    "Server: Commit Changes         ": commitServerChangeResponse,
    "Reorder Items                  ": commitReorderItems,
    "File Action                    ": dispatchFileAction,

    // Vue
    "Registers Components           ": registerComponents,
    "Reset Form Data                ": vueResetFormData,
    "Start Vue                      ": startVue,

    // Global
    "Load                           ": load,
    "Handle Response                ": handleResponse,
    "Ajax                           ": ajax,
};


import {v4 as uuidv4} from 'uuid';
import $ from 'jquery';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import {ChangeType, Constants, FileAction, Global, MenuItem, Modify, StateChange} from './types';
import {
    AjaxConfig,
    DirFile,
    Drive,
    EmbeddedInfo,
    FunctionDec,
    GlobalType,
    IData,
    IError,
    Keys,
    Locale,
    LogType,
    mFile,
    MultilangText,
    NotificationInfo,
    ObjectDec,
    Pair,
    Property,
    RequestMode,
    StatusCode,
    WebMethod,
    WebResponse
} from '../../sys/src/types';
import App from './App.vue';

declare let io: any;
export let glob = new Global();
let store;

export function getText(text: string | MultilangText, useDictionary?: boolean): string {
    if (!text) return "";

    if (typeof text == "string") {
        if (!useDictionary) return text;
        if (glob.texts[text]) return glob.texts[text];
        if (text.indexOf('.') == -1) {
            return glob.texts["sys." + text] || text.replace(/-/g, " ");
        }
        return text.replace(/-/g, " ");
    }

    let localeName = Locale[glob.config.locale];
    if (text[localeName])
        return text[localeName];
    else
        return Object.values(text)[0];
}

export function $t(text: string): string {
    return getText(text, true);
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

export function evalExpression($this: any, expression: string): any {
    try {
        if (expression == null) {
            return null;
        }
        return eval(expression.replace(/\bthis\b/g, '$this'));
    } catch (ex) {
        console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
    }
}

function addHeadStyle(css: string) {
    let head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
}

function vueResetFormData(res: WebResponse) {
    // console.log(res);
    let dataset = res.data;

    if (!dataset) return;

    if (res.form && res.form.declarations) {
        res.form.elems.forEach(elem => elem.id = uuidv4()); // needs for refreshing form while cancel changes

        const setDataMeta = (ref: string, item: IData, dec: ObjectDec | FunctionDec) => {
            item._ = item._ || {ref} as any;
            item._.dec = dec;
            return item._;
        };

        for (let ref in dataset) {
            let data = dataset[ref];
            let dec = res.form.declarations[ref];
            if (!data || !dec)
                continue;

            if (Array.isArray(data)) {
                data.forEach((item: IData) => {
                    let meta = setDataMeta(ref + "/" + getBsonId(item), item, dec);
                    meta.marked = null;
                });
            } else
                setDataMeta(ref, data, dec);

            for (const prop of dec.properties) {
                if (Array.isArray(data))
                    data.forEach(item => setUndefinedToNull(item, prop));
                else
                    setUndefinedToNull(data, prop);
            }
        }
    }

    glob.data = res.data;
    glob.form = res.form;
    glob.headFuncs = [];
    commitReloadData(store, res.data);
}

function setUndefinedToNull(item, prop: Property) {
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

export function getDec(data: IData): ObjectDec | FunctionDec {
    return data._ ? data._.dec : null;
}

function validateData(data: IData, ref: string): boolean {
    let meta = data._;
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

export function validate(dataset: any): boolean {
    for (const ref in dataset) {
        if (Array.isArray(dataset[ref])) {
            for (const item of dataset[ref]) {
                if (!validateData(item, ref)) return false;
            }
        } else if (!validateData(dataset[ref], ref)) return false;
    }
    return true;
}

export function someProps(prop): boolean {
    return Array.isArray(prop.properties) && prop.properties.length;
}

export function prepareServerUrl(ref: string): string {
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

export function handleResponse(res: WebResponse) {
    if (!res) throw "handleResponse: res is empty";
    if (typeof res != "object") {
        console.warn("handleResponse res", res);
        throw "handleResponse: res must be object";
    }

    res = flat2recursive(res);

    if (res.config) {
        glob.config = res.config;
        if (res.config.style)
            addHeadStyle(res.config.style);
    }
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, LogType.Info);
    else if (res.form) {
        // WARNING: never change these orders:
        vueResetFormData(res);
        document.title = glob.form.title as string;
        $('.details-view').scrollTop(0);
    } else {
        notify("WHAT should I do now?", LogType.Warning);
        console.log(res);
    }

    // must be set after binding to Vue
    glob.texts = glob.texts || res.texts || {};
}

export function getPropTextValue(meta: Property, data): any {
    if (meta.formula) return evalExpression(this.doc, meta.formula);
    if (!data) throw 'prop-text doc is null!';

    let val = data[meta.name];
    if (val && typeof val == 'object') {
        let locale = getQs('e') || 'en';
        return val[locale];
    } else
        return val;
}

export function equalRef(ref1: any, ref2: any): boolean {
    if (!ref1 && !ref2) {
        return true;
    } else if (!ref1 || !ref2) {
        return false;
    } else if (ref1.$oid) {
        return ref1.$oid == ref2.$oid;
    } else {
        return ref1 == ref2;
    }
}

export function getPropReferenceValue(prop: Property, data: any): string {
    if (!data) return '';
    let val = data[prop.name];
    if (!val) return '';

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
    } else {
        let item = prop._.items.find(i => equalRef(i.ref, val));
        if (!item) return '...';
        return item.title;
    }
}

function refresh() {
    glob.dirty = false;
    location.reload();
}

export function handleResponseRedirect(res: WebResponse) {
    if (res.redirect == Constants.redirectBack) {
        window.history.back();
    } else if (res.redirect == Constants.redirectSelf) {
        refresh();
    } else if (!$.isEmptyObject(res.data)) {
        let form = '';
        for (let key of res.data) {
            form += '<input type="hidden" name="' + key + '" value="' + res.data[key] + '">';
        }
        $('<form action="' + res.redirect + '" method="POST">' + form + '</form>').appendTo('body').submit();
    } else {
        window.open(res.redirect, '_self'); // res.newWindow ? '_blank' : '_self'
    }
}

export function isRtl() {
    return $('body').attr('dir') == 'rtl';
}

export function showCmenu(state, items: MenuItem[], event, handler: (state, item: MenuItem) => void) {
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
        } else {
            items[0].hover = true;
        }
    }

    glob.cmenu = {show: true, items, handler, state, top: 0, left: 0, right: 0, bottom: 0, event};
}

export function hideCmenu() {
    glob.cmenu.show = false;
}

function handleWindowEvents() {
    $(window)
        .on(Constants.notifyEvent, function (e: any) {
            let notify = e.detail as NotificationInfo;
            if (notify.type == LogType.Debug) {
                $("#snackbar").addClass("visible").text(notify.message);
                setTimeout(function () {
                    $("#snackbar").removeClass("visible");
                }, 3000);
            } else
                glob.notify = notify;
        })
        .on(Constants.questionEvent, function (e: any) {
            glob.question = e.detail;
        })
        .on("popstate", (e) => {
            load(location.href);
        })
        .on("beforeunload", (e: any) => {
            if (glob.dirty) {
                e = e || window.event;
                if (e)
                    e.returnValue = $t('save-before');
                return $t('save-before');
            }
        })
        .on("resize", (e) => {
            hideCmenu();
        })
        .on("keydown", (e) => {
            if (glob.cmenu.show)
                handleCmenuKeys(e);
            glob.notify = null;
        })
        .on("click", (e: any) => {
            let el = e.target as HTMLAnchorElement;
            if (el.tagName !== "A" || el.getAttribute('target')) return;   // especially _blank

            let href = el.getAttribute('href');
            if (href) {
                if (href.match(/^javascript/) || /^#/.test(href)) return; // if (/^#/.test(href)) return false;
                e.preventDefault();
                if (glob.dirty) {
                    notify($t('save-before'), LogType.Warning);
                    return;
                } // dirty page
                if (/\bf=\d/.test(href)) { // function link

                } else
                    history.pushState(null, null, href);
                load(href);
                e.stopPropagation()
            }
        })
        .on("mouseup", (e: any) => {
            if (glob.cmenu.show &&
                !$('.dropdown-item').is(e.target)
                && $('.dropdown-item').has(e.target).length === 0
                && $('.dropdown-menu.show').has(e.target).length === 0
            ) hideCmenu();
        });
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
            } else {
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
            } else {
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

export function getQs(key: string): string {
    let search = location.search;
    let query = new URLSearchParams(search);
    return query.get(key);
}

export function setQs(key: string, value: any, fullPath: boolean, href?: string): string {
    let search, el;
    if (href) {
        el = document.createElement('a');
        el.href = href;
        search = el.search;
    } else {
        search = location.search;
    }
    let query = new URLSearchParams(search);
    if (value == null) {
        query.delete(key);
    } else {
        query.set(key, value.toString());
    }

    if (href) {
        return el.pathname + '?' + query;
    } else {
        return fullPath ? (location.pathname + '?' + query) : query.toString();
    }
}

export function checkPropDependencyOnChange(dec: ObjectDec | FunctionDec, prop, instance: any) {
    if (!instance) return;
    let dependents = dec.properties.filter(p => p.dependsOn == prop.name);
    for (const prop of dependents) {
        instance[prop.name] = null;
        if (prop._.items) {
            prop._.items = null;
            let data = {prop, instance};
            ajax('/getPropertyReferenceValues', data, null, res => prop._.items = res.data, err => notify(err));
        }
    }
}

function parse(str: string): any {
    if (!str) return null;
    let flatJson = JSON.parse(str);
    return flat2recursive(flatJson);
}

export function flat2recursive(flatJson: any): any {
    if (!flatJson) return flatJson;
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
                } else if (val._$) {
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

export function browseFile(fileBrowsed?: (files: FileList) => void) {
    glob.fileGallery.fileBrowsed = fileBrowsed;
    $('#file-browse').val('').click();
}

export function refreshFileGallery(file?: string) {
    openFileGallery(glob.fileGallery.drive, file, glob.fileGallery.path, glob.fileGallery.fixedPath, glob.fileGallery.fileSelectCallback);
}

export function openFileGallery(drive: Drive, file: string, path: string, fixedPath: boolean,
                                fileSelectCallback: (path: string, item: DirFile) => void) {
    glob.fileGallery = {
        list: [],
        loading: true,
        drive,
        file,
        path: path || '',
        fixedPath,
        selectable: true,
        show: true,
        fileSelectCallback: fileSelectCallback
    };

    ajax('/getFileGallery?m=1', {drive: drive._id, path}, {}, res => {
        glob.fileGallery.loading = false;
        glob.fileGallery.uri = res.data.uri;
        glob.fileGallery.list = res.data.list;
        glob.fileGallery.selected = glob.fileGallery.list.find(l => l.name === glob.fileGallery.file);
    });
}

export function log(...message) {
    console.log(message);
}

export function invoke(pack: string, name: string, args: any[]) {
    return false;
}

export function toFriendlyFileSizeString(size: number): string {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB';
    } else {
        return (size / 1024 / 1024).toFixed(1) + ' MB';
    }
}

export function joinUri(...parts: string[]): string {
    let uri = '';
    for (const part of parts) {
        uri += '/' + (part || '').replace(/^\//, '').replace(/\/$/, '');
    }
    return uri.substr(1);
}

export function notify(content: string | IError, type?: LogType, params?: NotificationInfo) {
    if (!content) {
        return;
    }
    const message = typeof content === 'string' ? content : content.message;
    if (type == null) {
        if (typeof content !== 'string') {
            type = content.code && content.code !== StatusCode.Ok ? LogType.Error : LogType.Info;
        } else {
            type = LogType.Info;
        }
    }

    if (type === LogType.Fatal)
        $("#app").html(`<div style="color:red; font-family: monospace;padding: 40px;"><h1>Fatal error</h1>${content}</div>`);
    else
        window.dispatchEvent(new CustomEvent(Constants.notifyEvent, {detail: {message, type}}));
}

export function question(questionId: string, message: string, options: Pair[], select: (item: Pair) => void) {
    window.dispatchEvent(new CustomEvent(Constants.questionEvent, {detail: {questionId, message, options, select}}));
    glob.question.show = true;
}

export function getBsonId(item: IData): string {
    if (!item) {
        throw 'Item is null';
    } else if (!item._id) {
        console.error('Invalid item data, _id is expected:', item);
        notify('Invalid data, please check the logs!', LogType.Error);
        return null;
    } else {
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
    if (document.querySelector('link[href=\'' + href + '\']'))
        return;

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

export function setPropertyEmbeddedError(doc: any, propName: string, error: string) {
    console.assert(doc, `setPropertyEmbeddedError doc is empty, prop:${propName}!`);
    doc._ = doc._ || {};
    doc._[propName] = doc._[propName] || {};
    (doc._[propName] as EmbeddedInfo).err = error;
}

export function load(href) {
    if (glob.dirty) {
        notify($t('save-before'), LogType.Warning);
        return;
    }

    ajax(setQs('m', RequestMode.inline, false, href), null, null, handleResponse, err => notify(err));
}

export function ajax(url: string, data, config: AjaxConfig, done: (res: WebResponse) => void,
                     fail?: (err: { code: StatusCode, message: string }) => void) {

    config = config || {};
    let headers = {};
    if (glob.config.host) {
        url = joinUri(glob.config.host, url);
    }
    let params: any = {url, data, headers, withCredentials: true};
    if (config.method) {
        params.method = config.method;
    } else {
        params.method = data ? WebMethod.post : WebMethod.get;
    }

    if (data) { // extract files raw data
        let formData: FormData = null;
        for (let key in data) {
            if (!data[key]) continue;
            let itemArray: any[] = Array.isArray(data[key]) ? data[key] : [data[key]];
            for (let item of itemArray) {
                if (item._ && item._.rawData) {
                    formData = formData || new FormData();
                    let blob = (item as mFile)._.rawData;
                    formData.append('files[]', blob, (item as mFile).name);
                    delete (item as mFile)._.rawData;
                }
            }
        }

        if (formData) {
            params.data = formData;
            params.data.append('data', JSON.stringify(data));
            params.headers['Content-Type'] = 'multipart/form-data';
        }
    }

    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    fail = fail || notify;
    console.log(params);
    startProgress();
    axios(params).then(res => {
        stopProgress();
        if (res.status && res.status !== StatusCode.Ok) {
            fail({code: res.status, message: res.statusText});
        } else {
            try {
                done(res.data);
            } catch (ex) {
                notify(`error on handling ajax response: ${ex.message}`);
                console.error(res, ex);
            }
        }
    }).catch(err => {
        stopProgress();
        console.error(`error on ajax '${url}'`, err);

        if (err.response && err.response.data && err.response.data.message) {
            fail({message: err.response.data.message, code: err.response.data.code});
        } else if (err.response && err.response.data) {
            fail({message: err.response.data, code: err.response.status});
        } else {
            fail({message: err.toString(), code: StatusCode.UnknownError});
        }
    });
}

function startProgress() {
    glob.progress = 0;
    setTimeout(() => {
        if (glob.progress != null) {
            glob.progress = 1;
            setTimeout(() => glob.progress = glob.progress ? 50 : 0, 0);
            setTimeout(() => glob.progress = glob.progress ? 95 : 0, 1000);
        }
    }, Constants.delayToStartProgressBar);
}

function stopProgress() {
    glob.progress = null;
}

function registerComponents(vue, components) {
    vue.component('function', require("@/components/Function.vue").default);
    vue.component('panel', require("@/components/Panel.vue").default);
    vue.component('modal', require("@/components/Modal.vue").default);
    vue.component('prop', require("@/components/Prop.vue").default);
    vue.component('object-view', require("@/components/ObjectView.vue").default);
    vue.component('document-editor', require("@/components/DocumentEditor.vue").default);
    vue.component('form-elem', require("@/components/FormElem.vue").default);
    vue.component('grid-view', require("@/components/GridView.vue").default);
    vue.component('details-view', require("@/components/DetailsView.vue").default);
    vue.component('check-box', require("@/components/CheckBox.vue").default);
    vue.component('log-terminal', require("@/components/LogTerminal.vue").default);
    vue.component('api-doc', require("@/components/ApiDoc.vue").default);

    if (components) {
        for (let component in components) {
            vue.component(component, components[component]);
        }
    }
}

function startVue(res: WebResponse, app, components) {
    try {
        handleWindowEvents();
        Vue.use(Vuex);
        store = createStore();
        handleResponse(res);
        if (typeof io != "undefined") glob.socket = io();
        Object.assign(Vue.config, {productionTip: false, devtools: true});
        Vue.prototype.glob = glob;
        Vue.prototype.$t = $t;
        Vue.config.productionTip = false;
        Vue.directive('focus', {
            inserted(el, binding) {
                if (binding.value) el.focus();
            }
        });

        registerComponents(Vue, components);
        new Vue({data: glob, store, render: h => h(app || App)}).$mount('#app');
    } catch (err) {
        console.error(err);
        notify("<strong>Starting Vue failed:</strong> " + err.message, LogType.Fatal);
    }
}

function commitFileAction(store, action: FileAction) {
    store.commit('_commitFileAction', action);
}

function _commitFileAction(state, e: FileAction) {
    e.item[e.prop.name] = e.val;
    glob.dirty = true;
}

export function dispatchFileAction(vue: Vue, e: FileAction) {
    vue.$store.dispatch('_dispatchFileAction', e);
}

function _dispatchFileAction(store, e: FileAction) {
    let modify = {
        ref: e.item._.ref,
        type: ChangeType.EditFileProp,
        data: {},
        state: e.item,
    } as Modify;
    glob.modifies.push(modify);
    modify.data[e.prop.name] = e.val;
    commitFileAction(store, e);
}

function commitReloadData(store, data: any) {
    store.commit('_commitReloadData', data);
}

function _commitReloadData(state, data: any) {
    state.data = data;
}

export function commitStoreChange(store, change: StateChange) {
    store.commit('_commitStoreChange', change);
}

function _commitStoreChange(state, change: StateChange) {
    let ref = change.uri;

    switch (change.type) {
        case ChangeType.EditProp:
            change.item[change.prop.name] = change.value;
            // todo : multi language text
            // if (change.prop._.gtype === GlobalType.string && change.prop.text && change.prop.text.multiLanguage && change.value && typeof (change.value) == "object") {
            //     for (let locale in change.value) {
            //         change.vue.$set(change.item[change.prop.name], locale, change.value[locale]);
            //     }
            // }

            // todo : remove dependecny change here
            // let dependents = this.dec.properties.filter(p => p.dependsOn == change.prop.name);
            // for (const prop of dependents) {
            //     change.item[prop.name] = null;
            //     if (prop._.items)
            //         prop._.items = null;
            // }
            break;

        case ChangeType.InsertItem:
            state.data[ref].push(change.item);
            break;

        case ChangeType.DeleteItem:
            state.data[ref].splice(state.data[ref].indexOf(change.item), 1);
            break;
    }

    change.vue.$forceUpdate();
}

export function commitServerChangeResponse(store, modify: Modify, res: any) {
    store.commit('_commitServerChangeResponse', {modify, res});
}

function _commitServerChangeResponse(store, arg: { modify: Modify, res: any }) {
    switch (arg.modify.type) {
        case ChangeType.EditProp:
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            break;

        case ChangeType.InsertItem:
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

export function commitReorderItems(store, items: IData[], up: boolean) {
    store.commit('_commitReorderItems', {items, up});
}

function _commitReorderItems(store, arg) {
    let {items, up} = arg as { items: IData[], up: boolean };
    let item = items.find(item => item._.marked);
    let index = items.indexOf(item);
    if ((up && index == 0) || (!up && index == items.length - 1)) return;
    glob.dirty = true;

    let emptyZs = items.filter(item => !item._z);
    if (emptyZs.length) {
        let min = Math.min(...items.map(item => item._z)) || 0;
        items.forEach(item => item._z = ++min);
    }

    let siblingIndex = up ? index - 1 : index + 1;
    let sibling = items[siblingIndex];

    // check if _z are same (happens in some situations)
    if (item._z == sibling._z) {
        let min = Math.min(...items.map(item => item._z));
        items.forEach(item => item._z = min++);
    }
    // replace items _z
    let _z = item._z;
    item._z = sibling._z;
    sibling._z = _z;
    // reorder items index for UI effect
    items.splice(index, 1);
    items.splice(siblingIndex, 0, item);
}

export function dispatchStoreModify(vue: Vue, change: StateChange) {
    vue.$store.dispatch('_dispatchStoreModify', change);
}

function _dispatchStoreModify(store, change: StateChange) {
    let ref = change.uri;
    switch (change.type) {
        case ChangeType.EditProp: {
            let modify = glob.modifies.find(m => m.state == change.item && (m.type == ChangeType.InsertItem || m.type == ChangeType.EditProp));
            if (!modify) {
                modify = {ref, type: ChangeType.EditProp, data: {} as IData, state: change.item};
                glob.modifies.push(modify);
            }
            modify.data[change.prop.name] = change.value;
            break;
        }

        case ChangeType.InsertItem: {
            let data = {_id: change.item._id};
            if (change.item._z) data["_z"] = change.item._z;
            glob.modifies.push({ref, type: ChangeType.InsertItem, data, state: change.item});
            break;
        }

        case ChangeType.DeleteItem: {
            ref = ref + "/" + getBsonId(change.item);
            let modify = glob.modifies.find(m => m.state == change.item);
            if (modify) {
                glob.modifies.splice(glob.modifies.indexOf(modify), 1);
                if (modify.type != ChangeType.InsertItem) // delete before saving in server
                    glob.modifies.push({state: change.item, ref, type: ChangeType.DeleteItem});
            } else
                glob.modifies.push({state: change.item, ref, type: ChangeType.DeleteItem});
            break;
        }

    }

    glob.dirty = glob.modifies.length > 0;
    commitStoreChange(store, change);
}

export function dispatchRequestServerModify(store, done: (err?) => void) {
    store.dispatch('_dispatchRequestServerModify', done);
}

function _dispatchRequestServerModify(store, done: (err?) => void) {
    if (glob.modifies.length == 0) {
        notify($t('saved'), LogType.Debug);
        glob.dirty = false;
        return done();
    }

    let modify = glob.modifies.shift();
    //main.log(modify.type, modify.ref, modify.data);
    let method = WebMethod.patch;
    switch (modify.type) {
        case ChangeType.InsertItem:
            method = WebMethod.post;
            break;

        case ChangeType.DeleteItem:
            method = WebMethod.del;
            break;
    }
    ajax(prepareServerUrl(modify.ref), modify.data, {method}, (res) => {
        res.data = flat2recursive(res.data);
        commitServerChangeResponse(store, modify, res.data);

        if (res.redirect && glob.modifies.length == 0)
            return handleResponseRedirect(res);
        else
            dispatchRequestServerModify(store, done);
    }, (err) => {
        glob.modifies.unshift(modify);
        done(err);
        notify(err);
    });
}

function createStore() {
    return new Vuex.Store({
        mutations: {
            _commitStoreChange,
            _commitServerChangeResponse,
            _commitReloadData,
            _commitFileAction,
            _commitReorderItems,
        },
        actions: {
            _dispatchStoreModify,
            _dispatchFileAction,
            _dispatchRequestServerModify,
        }
    });
}

export function start(app?, components?) {
    // console.log('starting ...');
    const mainState = $('#main-state').html();
    const res: WebResponse = parse(mainState);

    if (res)
        startVue(res, app, components);
    else {
        let uri = setQs('m', RequestMode.inlineDev, false, (location.pathname && location.pathname != '/') ? location.pathname : Constants.defaultAddress);
        uri = setQs('t', Math.random(), false, uri);
        console.log(`loading main-state async from '${uri}' ...`);
        axios.get(uri, {withCredentials: true}).then(res => {
            if (res.data)
                startVue(res.data, app, components);
            else
                console.error(res);
        }).catch(err => {
            console.error(err);
            notify("Connecting to proxy server failed! " + err.message, LogType.Fatal);
        });
    }
}

window["start"] = start;
export default {};
