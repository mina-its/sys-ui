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
    "Handle Response                ": handleResponse,
    "Load                           ": load,
    "Ajax                           ": ajax,
};


import {v4 as uuidv4} from 'uuid';
import {parse} from 'bson-util';
import Vue from 'vue';
import Vuex from 'vuex';
import {
    Axios,
    ChangeType,
    Constants,
    FileAction,
    Global,
    JQuery,
    MenuItem,
    Modify,
    Socket,
    StartParams,
    StateChange,
    FilterOperator,
    QuestionOptions
} from './types';
import {
    AjaxConfig,
    DirFile,
    Drive,
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

declare let $: JQuery, axios: Axios, io: Socket, marked: any;
export let glob = new Global();
let store;

export function getText(text: string | MultilangText, useDictionary?: boolean): string {
    if (!text) return "";

    if (typeof text == "string") {
        if (!useDictionary) return text;
        if (glob.texts[text]) return glob.texts[text];

        if (text.indexOf('.') == -1) {
            return glob.texts["sys." + text] || text.replace(/-/g, " ");
        } else {
            return text.replace(/^.+\./, "").replace(/-/g, " ");
        }
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
            item._ = item._ || {} as any;
            item._.ref = ref;
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
    glob.form = res.form as any;
    store.commit('_commitReloadData', glob.data);
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
            notify(`Property '${prop.title}' is required.`, LogType.Warning);
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
    // if (typeof res != "object") {
    //     console.warn("handleResponse res", res);
    //     throw "handleResponse: res must be object";
    // }

    // console.log("res", res);

    if (res.config) {
        glob.config = res.config;
        if (res.config.style)
            addHeadStyle(res.config.style);

        if (glob.config.host && /^https?:/.test(glob.config.host)) {
            let currentProtocol = location.protocol;
            glob.config.host = glob.config.host.replace(/^https?:/, currentProtocol);
        }
    }
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, LogType.Info);
    else if (res.form) {
        // WARNING: never change these orders:
        vueResetFormData(res);
        if (getQs(Constants.QUERY_NEW))
            initializeModifyForQueryNew(res);

        document.title = glob.form.title as string;
        $('.details-view').scrollTop(0);
        $(window).scrollTop(0);
    } else {
        notify("WHAT should I do now?", LogType.Warning);
        console.log(res);
    }

    // must be set after binding to Vue
    glob.texts = glob.texts || res.texts || {};
}

function initializeModifyForQueryNew(res: WebResponse) {
    glob.dirty = true;
    let ref = location.pathname.replace(/\//g, "");
    let data = res.data[ref];
    let modifyData = {_id: -1};
    for (let prop in data) {
        if (data.hasOwnProperty(prop) && data[prop] != null)
            modifyData[prop] = data[prop];
    }

    glob.modifies.push({
        ref,
        type: ChangeType.InsertItem,
        data: modifyData,
        state: data
    });
}

export function digitGroup(num: number): string {
    if (num == null) return "";
    let numParts = num.toString().split('.');
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return numParts.join('.');
}

export function getPropTextValue(meta: Property, data) {
    if (meta.formula) return evalExpression(data, meta.formula);
    if (!data) throw 'prop-text doc is null!';

    let val = data[meta.name];
    if (val && typeof val == 'object') {
        let locale = getQs('e') || 'en';
        return val[locale];
    } else
        return val;
}

export function equalID(id1: any, id2: any): boolean {
    if (!id1 && !id2) {
        return true;
    } else if (!id1 || !id2) {
        return false;
    } else if (id1.$oid) {
        return id1.$oid == id2.$oid;
    } else {
        return id1 == id2;
    }
}

export function getPropReferenceValue(prop: Property, data: any): string {
    if (!data) return '';
    let val = data[prop.name];
    if (val == null) return '';

    if (prop.isList) {
        if (!Array.isArray(val))
            val = [val];

        let values = [];
        for (const valItem of val) {
            let item = prop._.items.find(i => equalID(i.ref, valItem));
            if (!item)
                values.push('...');
            else
                values.push(item.title);
        }
        return values.join(', ');
    } else {
        let item = prop._.items.find(i => equalID(i.ref, val));
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
    } else if (res.data != null) {
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

                if (/^http/.test(href)) {
                    e.stopPropagation();
                    window.open(href);
                    return;
                }

                if (/\bf=\d/.test(href)) { // function link

                } else
                    history.pushState(null, null, href);
                load(href);
                e.stopPropagation();
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

    let url;
    if (href)
        url = [el.pathname, query].join("?");
    else
        url = fullPath ? [location.pathname, query].join("?") : query.toString();
    return url.replace(/\?$/, "");
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
        if (res.code != StatusCode.Ok) {
            glob.fileGallery.show = false;
            notify(res.message, LogType.Error);
            return;
        }

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

export function question(title: string, message: string, buttons: Pair[], options: QuestionOptions, select: (ref: any) => void) {
    window.dispatchEvent(new CustomEvent(Constants.questionEvent, {detail: {title, message, buttons, options, select}}));
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

export function loadHeadScript(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
}

export function loadBodyScript(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
}

export function delScript(src) {
    const el = document.querySelector('script[src=\'' + src + '\']');
    if (el) {
        el.remove();
    }
}

export function addHeadLink(href) {
    if (document.querySelector('link[href=\'' + href + '\']'))
        return;

    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
}

export function loadBodyLink(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');

    document.body.appendChild(link);
}

export function delLink(href) {
    const el = document.querySelector('link[href="' + href + '"]');

    if (el) {
        el.remove();
    }
}

export function setPropertyEmbeddedError(doc: any, propName: string, error: string) {
    if (error) {
        doc._ = doc._ || {};
        doc._[Constants.errorEmbedProperty] = doc._[Constants.errorEmbedProperty] || {};
        doc._[Constants.errorEmbedProperty][propName] = error;
    } else if (doc && doc._ && doc._[Constants.errorEmbedProperty]) {
        delete doc._[Constants.errorEmbedProperty][propName];
    }
}

export function getPropertyEmbedError(doc: any, propName: string): string {
    if (doc && doc._ && doc._[Constants.errorEmbedProperty])
        return doc._[Constants.errorEmbedProperty][propName];
    else
        return null;

}

export function call(funcName: string, data: any, done: (err, data?) => void) {
    ajax(setQs('m', RequestMode.inline, false, "/" + funcName), data, null, res => done(null, res.data), err => done(err));
}

export function load(href: string, pushState = false) {
    if (glob.dirty) {
        // if (glob.form.toolbar) {
        notify($t('save-before'), LogType.Warning);
        return;
        // } else {
        //     glob.modifies = [];
        //     glob.dirty = false;
        // }
    }

    if (pushState && location.href != href) {
        history.pushState(null, null, href);
    }

    glob.notify = null;
    ajax(setQs('m', RequestMode.inline, false, href), null, null, handleResponse, err => notify(err));
}

export function ajax(url: string, data, config: AjaxConfig, done: (res: WebResponse) => void, fail?: (err: { code: StatusCode, message: string }) => void) {
    startProgress();
    config = config || {};
    fail = fail || notify;
    if (glob.config.host) url = joinUri(glob.config.host, url);

    // ajax params
    let params: any = {
        url,
        data,
        transformResponse: res => res,
        method: config.method || (data ? WebMethod.post : WebMethod.get),
        headers: {},
        withCredentials: true
    };

    // extract files raw data
    if (data) {
        let formData: FormData = null;
        for (let key in data) {
            if (!data[key]) continue;
            let itemArray: any[] = Array.isArray(data[key]) ? data[key] : [data[key]];
            for (let item of itemArray) {
                if (item._ && item._.rawData) {
                    formData = formData || new FormData();
                    let blob = (item as mFile)._.rawData as any as Blob;
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

    // Cross origin support
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    // Ajax call
    axios(params).then(res => {
        stopProgress();
        if (res.status && res.status !== StatusCode.Ok) {
            fail({code: res.status, message: res.statusText});
        } else {
            try {
                let result = parse(res.data);
                //console.log(result);
                done(result);
            } catch (ex) {
                notify(`error on handling ajax response: ${ex.message}`);
                console.error(res, ex);
            }
        }
    }).catch(err => {
        stopProgress();
        console.info(`error on ajax '${url}'`);
        console.error(err);

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
    const requireComponent = require.context('./components', false, /\.vue$/);
    requireComponent.keys().forEach(fileName => {
        const componentConfig = requireComponent(fileName);
        const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
        Vue.component(componentName, componentConfig.default || componentConfig)
    });

    if (components) {
        for (let name in components) {
            vue.component(name, components[name]);
        }
    }

    vue.component("SysApp", App);
}

function startVue(res: WebResponse, params?: StartParams) {
    try {
        handleWindowEvents();

        Vue.use(Vuex);
        store = new Vuex.Store({
            state: {data: null},
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

        handleResponse(res);
        if (typeof io != "undefined") glob.socket = io();
        Object.assign(Vue.config, {productionTip: false, devtools: true});
        Vue.prototype.glob = glob;
        Vue.prototype.$t = $t;
        Vue.prototype.rtl = glob.config.rtl;
        Vue.prototype.ltr = !glob.config.rtl;
        Vue.config.productionTip = false;
        Vue.directive('focus', {
            inserted(el, binding) {
                if (binding.value) el.focus();
            }
        });

        if (glob.config.rtl) $("html").attr("dir", "rtl");
        registerComponents(Vue, params ? params.components : null);

        new Vue({data: glob, store, render: h => h((params ? params.app : null) || App)}).$mount('#app');
    } catch (err) {
        console.error(err);
        notify("<strong>Starting Vue failed:</strong> " + err.message, LogType.Fatal);
    }
}

function commitFileAction(store, action: FileAction) {
    store.commit('_commitFileAction', action);
}

function _commitFileAction(state, e: FileAction) {
    e.item[e.prop.name] = e.val || null;
    glob.dirty = true;
}

export function dispatchFileAction(vue: Vue, e: FileAction) {
    vue["$store"].dispatch('_dispatchFileAction', e); // .$store had problem in other packages
}

function _dispatchFileAction(store, e: FileAction) {
    if (e.item._.ref == null) throw "ref is empty!";

    let modify = {
        ref: e.item._.ref,
        type: ChangeType.EditFileProp,
        data: {},
        state: e.item,
    } as Modify;
    glob.modifies.push(modify);
    modify.data[e.prop.name] = e.val || null;

    commitFileAction(store, e);
}

function _commitReloadData(state, data: any) {
    state.data = data;
}

export function clearModifies() {
    glob.dirty = false;
    glob.modifies = [];
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

export function sort(array: any[], prop: string = "_z"): any[] {
    function compare(a, b) {
        if (a[prop] < b[prop]) {
            return -1;
        }
        if (a[prop] > b[prop]) {
            return 1;
        }
        return 0;
    }

    array.sort(compare);
    return array;
}

export function commitReorderItems(store, items: IData[], up: boolean, uri: string, item: any) {
    store.commit('_commitReorderItems', {items, up, uri, item});
}

function _commitReorderItems(store, arg) {
    let {items, up, uri, item} = arg as { items: IData[], up: boolean, uri: string, item: any };
    let index = items.indexOf(item);
    if ((up && index == 0) || (!up && index == items.length - 1)) return;
    glob.dirty = true;

    let emptyZs = items.filter(item => !item._z);
    if (emptyZs.length) {
        let min = Math.min(...items.map(item => item._z)) || 0;
        items.forEach(item => {
            item._z = ++min;
            modifyOrder(item, uri);
        });
    }

    let siblingIndex = up ? index - 1 : index + 1;
    let sibling = items[siblingIndex];

    // check if _z are same (happens in some situations)
    if (item._z == sibling._z) {
        let min = Math.min(...items.map(item => item._z));
        items.forEach(item => {
            item._z = min++;
            modifyOrder(item, uri);
        });
    }
    // replace items _z
    let _z = item._z;
    item._z = sibling._z;
    modifyOrder(item, uri);

    sibling._z = _z;
    modifyOrder(sibling, uri);

    // reorder items index for UI effect
    items.splice(index, 1);
    items.splice(siblingIndex, 0, item);
}

function modifyOrder(item: any, uri: string) {
    let modify = glob.modifies.find(m => m.state == item && (m.type == ChangeType.InsertItem || m.type == ChangeType.EditProp));
    if (!modify) {
        modify = {ref: uri + "/" + getBsonId(item), type: ChangeType.EditProp, data: {} as IData, state: item};
        glob.modifies.push(modify);
    }
    modify.data._z = item._z;
}

export function dispatchStoreModify(vue: Vue, change: StateChange) {
    vue["$store"].dispatch('_dispatchStoreModify', change);
}

function _dispatchStoreModify(store, change: StateChange) {
    let ref = change.uri;
    switch (change.type) {
        case ChangeType.EditProp: {
            let modify: Modify;
            modify = glob.modifies.find(m => m.state == change.item && (m.type == ChangeType.InsertItem || m.type == ChangeType.EditProp));
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
    glob.notify = null;
    commitStoreChange(store, change);
}

export function dispatchRequestServerModify(store, done: (err?) => void) {
    store.dispatch('_dispatchRequestServerModify', done);
}

export function markDown(html: string): string {
    return marked(html).replace(/^\<p\>|\<\/p\>\s*$/g, "");
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
        res.data = parse(res.data);
        commitServerChangeResponse(store, modify, res.data);

        if (getQs("n")) {
            clearModifies();
            load("/" + modify.ref + "/" + res.data._id.$oid, true);
        } else if (res.redirect && glob.modifies.length == 0)
            return handleResponseRedirect(res);
        else
            dispatchRequestServerModify(store, done);
    }, (err) => {
        glob.modifies.unshift(modify);
        done(err);
        notify(err);
    });
}

export function start(params?: StartParams) {
    // console.log('starting ...');
    const mainState = $('#main-state').html();
    const res: WebResponse = parse(mainState);

    if (res)
        startVue(res, params);
    else {
        let uri = setQs('m', RequestMode.inlineDev, false, (location.pathname && location.pathname != '/') ? location.pathname + location.search : Constants.defaultAddress);
        uri = setQs('t', Math.random(), false, uri);
        if (getQs(Constants.QUERY_LOCALE))
            uri = setQs(Constants.QUERY_LOCALE, getQs(Constants.QUERY_LOCALE), false, uri);
        // console.log(`loading main-state async from '${uri}' ...`);
        axios.get(uri, {withCredentials: true}).then(res => {
            if (res.data)
                startVue(res.data, params);
            else
                console.error(res);
        }).catch(err => {
            console.error(err);
            notify("Connecting to proxy server failed! " + err.message, LogType.Fatal);
        });
    }
    return glob;
}

window["start"] = start;
export default {};
