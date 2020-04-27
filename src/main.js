"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const uuid_1 = require("uuid");
const vue_1 = tslib_1.__importDefault(require("vue"));
const vuex_1 = tslib_1.__importDefault(require("vuex"));
const types_1 = require("./types");
const types_2 = require("../../sys/src/types");
const App_vue_1 = tslib_1.__importDefault(require("./App.vue"));
exports.glob = new types_1.Global();
let store;
function getText(text, useDictionary) {
    if (!text)
        return "";
    if (typeof text == "string") {
        if (!useDictionary)
            return text;
        if (exports.glob.texts[text])
            return exports.glob.texts[text];
        if (text.indexOf('.') == -1) {
            return exports.glob.texts["sys." + text] || text.replace(/-/g, " ");
        }
        return text.replace(/-/g, " ");
    }
    let localeName = types_2.Locale[exports.glob.config.locale];
    if (text[localeName])
        return text[localeName];
    else
        return Object.values(text)[0];
}
exports.getText = getText;
function $t(text) {
    return getText(text, true);
}
exports.$t = $t;
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
function evalExpression($this, expression) {
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
exports.evalExpression = evalExpression;
function addHeadStyle(css) {
    let head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
}
function vueResetFormData(res) {
    // console.log(res);
    let dataset = res.data;
    if (!dataset)
        return;
    if (res.form && res.form.declarations) {
        res.form.elems.forEach(elem => elem.id = uuid_1.v4()); // needs for refreshing form while cancel changes
        const setDataMeta = (ref, item, dec) => {
            item._ = item._ || {};
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
                data.forEach((item) => {
                    let meta = setDataMeta(ref + "/" + getBsonId(item), item, dec);
                    meta.marked = null;
                });
            }
            else
                setDataMeta(ref, data, dec);
            for (const prop of dec.properties) {
                if (Array.isArray(data))
                    data.forEach(item => setUndefinedToNull(item, prop));
                else
                    setUndefinedToNull(data, prop);
            }
        }
    }
    exports.glob.data = res.data;
    exports.glob.form = res.form;
    exports.glob.headFuncs = [];
    exports.glob.newItemButton = null;
    commitReloadData(store, res.data);
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
function getDec(data) {
    return data._ ? data._.dec : null;
}
exports.getDec = getDec;
function validateData(data, ref) {
    let meta = data._;
    let requiredProps = meta.dec.properties.filter(p => p.required);
    for (const prop of requiredProps) {
        if (data[prop.name] == null) {
            notify(`Property '${prop.name}' is required.`, types_2.LogType.Warning);
            // if (!Array.isArray(glob.glob.form.dataset[ref]))
            // 	data._error = `Property '${prop.name}' is required.`;
            return false;
        }
    }
    return true;
}
function validate(dataset) {
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
exports.validate = validate;
function someProps(prop) {
    return Array.isArray(prop.properties) && prop.properties.length;
}
exports.someProps = someProps;
function prepareServerUrl(ref) {
    ref = '/' + ref;
    let locale = getQs('e');
    if (locale) {
        ref += '?e=' + locale;
    }
    return ref;
}
exports.prepareServerUrl = prepareServerUrl;
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;
function handleResponse(res) {
    if (!res)
        throw "handleResponse: res is empty";
    if (typeof res != "object") {
        console.warn("handleResponse res", res);
        throw "handleResponse: res must be object";
    }
    res = flat2recursive(res);
    if (res.config) {
        exports.glob.config = res.config;
        if (res.config.style)
            addHeadStyle(res.config.style);
    }
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, types_2.LogType.Info);
    else if (res.form) {
        // WARNING: never change these orders:
        vueResetFormData(res);
        document.title = exports.glob.form.title;
        $('.details-view').scrollTop(0);
    }
    else {
        notify("WHAT should I do now?", types_2.LogType.Warning);
        console.log(res);
    }
    // must be set after binding to Vue
    exports.glob.texts = exports.glob.texts || res.texts || {};
}
exports.handleResponse = handleResponse;
function getPropTextValue(meta, data) {
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
exports.getPropTextValue = getPropTextValue;
function equalRef(ref1, ref2) {
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
exports.equalRef = equalRef;
function getPropReferenceValue(prop, data) {
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
exports.getPropReferenceValue = getPropReferenceValue;
function refresh() {
    exports.glob.dirty = false;
    location.reload();
}
function handleResponseRedirect(res) {
    if (res.redirect == types_1.Constants.redirectBack) {
        window.history.back();
    }
    else if (res.redirect == types_1.Constants.redirectSelf) {
        refresh();
    }
    else if (res.data != null) {
        let form = '';
        for (let key of res.data) {
            form += '<input type="hidden" name="' + key + '" value="' + res.data[key] + '">';
        }
        $('<form action="' + res.redirect + '" method="POST">' + form + '</form>').appendTo('body').submit();
    }
    else {
        window.open(res.redirect, '_self'); // res.newWindow ? '_blank' : '_self'
    }
}
exports.handleResponseRedirect = handleResponseRedirect;
function isRtl() {
    return $('body').attr('dir') == 'rtl';
}
exports.isRtl = isRtl;
function showCmenu(state, items, event, handler) {
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
    exports.glob.cmenu = { show: true, items, handler, state, top: 0, left: 0, right: 0, bottom: 0, event };
}
exports.showCmenu = showCmenu;
function hideCmenu() {
    exports.glob.cmenu.show = false;
}
exports.hideCmenu = hideCmenu;
function handleWindowEvents() {
    $(window)
        .on(types_1.Constants.notifyEvent, function (e) {
        let notify = e.detail;
        if (notify.type == types_2.LogType.Debug) {
            $("#snackbar").addClass("visible").text(notify.message);
            setTimeout(function () {
                $("#snackbar").removeClass("visible");
            }, 3000);
        }
        else
            exports.glob.notify = notify;
    })
        .on(types_1.Constants.questionEvent, function (e) {
        exports.glob.question = e.detail;
    })
        .on("popstate", (e) => {
        load(location.href);
    })
        .on("beforeunload", (e) => {
        if (exports.glob.dirty) {
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
        if (exports.glob.cmenu.show)
            handleCmenuKeys(e);
        exports.glob.notify = null;
        switch (e.which) {
            case types_2.Keys.esc:
                $('.dropdown-menu').removeClass('show'); // date time picker
                break;
        }
    })
        .on("click", (e) => {
        let el = e.target;
        if (el.tagName !== "A" || el.getAttribute('target'))
            return; // especially _blank
        let href = el.getAttribute('href');
        if (href) {
            if (href.match(/^javascript/) || /^#/.test(href))
                return; // if (/^#/.test(href)) return false;
            e.preventDefault();
            if (exports.glob.dirty) {
                notify($t('save-before'), types_2.LogType.Warning);
                return;
            } // dirty page
            if (/\bf=\d/.test(href)) { // function link
            }
            else
                history.pushState(null, null, href);
            load(href);
            e.stopPropagation();
        }
    })
        .on("mouseup", (e) => {
        if (exports.glob.cmenu.show &&
            !$('.dropdown-item').is(e.target)
            && $('.dropdown-item').has(e.target).length === 0
            && $('.dropdown-menu.show').has(e.target).length === 0)
            hideCmenu();
    });
}
function handleCmenuKeys(e) {
    switch (e.which) {
        case types_2.Keys.tab:
        case types_2.Keys.esc:
            exports.glob.cmenu.handler(exports.glob.cmenu.state, null);
            hideCmenu();
            break;
        case types_2.Keys.enter: {
            let item = exports.glob.cmenu.items.find(i => i.hover);
            if (item) {
                exports.glob.cmenu.handler(exports.glob.cmenu.state, item);
                hideCmenu();
            }
            break;
        }
        case types_2.Keys.down: {
            let item = exports.glob.cmenu.items.find(i => i.hover);
            if (!item) {
                exports.glob.cmenu.items[0].hover = true;
            }
            else {
                let index = exports.glob.cmenu.items.indexOf(item);
                if (index < exports.glob.cmenu.items.length - 1) {
                    exports.glob.cmenu.items[index].hover = false;
                    exports.glob.cmenu.items[index + 1].hover = true;
                }
            }
            break;
        }
        case types_2.Keys.up: {
            let item = exports.glob.cmenu.items.find(i => i.hover);
            if (!item) {
                exports.glob.cmenu.items[exports.glob.cmenu.items.length - 1].hover = true;
            }
            else {
                let index = exports.glob.cmenu.items.indexOf(item);
                if (index > 0) {
                    exports.glob.cmenu.items[index].hover = false;
                    exports.glob.cmenu.items[index - 1].hover = true;
                }
            }
            break;
        }
    }
}
exports.handleCmenuKeys = handleCmenuKeys;
function getQs(key) {
    let search = location.search;
    let query = new URLSearchParams(search);
    return query.get(key);
}
exports.getQs = getQs;
function setQs(key, value, fullPath, href) {
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
exports.setQs = setQs;
function checkPropDependencyOnChange(dec, prop, instance) {
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
exports.checkPropDependencyOnChange = checkPropDependencyOnChange;
function parse(str) {
    if (!str)
        return null;
    let flatJson = JSON.parse(str);
    return flat2recursive(flatJson);
}
function flat2recursive(flatJson) {
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
exports.flat2recursive = flat2recursive;
function browseFile(fileBrowsed) {
    exports.glob.fileGallery.fileBrowsed = fileBrowsed;
    $('#file-browse').val('').click();
}
exports.browseFile = browseFile;
function refreshFileGallery(file) {
    openFileGallery(exports.glob.fileGallery.drive, file, exports.glob.fileGallery.path, exports.glob.fileGallery.fixedPath, exports.glob.fileGallery.fileSelectCallback);
}
exports.refreshFileGallery = refreshFileGallery;
function openFileGallery(drive, file, path, fixedPath, fileSelectCallback) {
    exports.glob.fileGallery = {
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
    ajax('/getFileGallery?m=1', { drive: drive._id, path }, {}, res => {
        if (res.code != types_2.StatusCode.Ok) {
            exports.glob.fileGallery.show = false;
            notify(res.message, types_2.LogType.Error);
            return;
        }
        exports.glob.fileGallery.loading = false;
        exports.glob.fileGallery.uri = res.data.uri;
        exports.glob.fileGallery.list = res.data.list;
        exports.glob.fileGallery.selected = exports.glob.fileGallery.list.find(l => l.name === exports.glob.fileGallery.file);
    });
}
exports.openFileGallery = openFileGallery;
function log(...message) {
    console.log(message);
}
exports.log = log;
function invoke(pack, name, args) {
    return false;
}
exports.invoke = invoke;
function toFriendlyFileSizeString(size) {
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
exports.toFriendlyFileSizeString = toFriendlyFileSizeString;
function joinUri(...parts) {
    let uri = '';
    for (const part of parts) {
        uri += '/' + (part || '').replace(/^\//, '').replace(/\/$/, '');
    }
    return uri.substr(1);
}
exports.joinUri = joinUri;
function notify(content, type, params) {
    if (!content) {
        return;
    }
    const message = typeof content === 'string' ? content : content.message;
    if (type == null) {
        if (typeof content !== 'string') {
            type = content.code && content.code !== types_2.StatusCode.Ok ? types_2.LogType.Error : types_2.LogType.Info;
        }
        else {
            type = types_2.LogType.Info;
        }
    }
    if (type === types_2.LogType.Fatal)
        $("#app").html(`<div style="color:red; font-family: monospace;padding: 40px;"><h1>Fatal error</h1>${content}</div>`);
    else
        window.dispatchEvent(new CustomEvent(types_1.Constants.notifyEvent, { detail: { message, type } }));
}
exports.notify = notify;
function question(questionId, message, options, select) {
    window.dispatchEvent(new CustomEvent(types_1.Constants.questionEvent, { detail: { questionId, message, options, select } }));
    exports.glob.question.show = true;
}
exports.question = question;
function getBsonId(item) {
    if (!item) {
        throw 'Item is null';
    }
    else if (!item._id) {
        console.error('Invalid item data, _id is expected:', item);
        notify('Invalid data, please check the logs!', types_2.LogType.Error);
        return null;
    }
    else {
        return item._id.$oid;
    }
}
exports.getBsonId = getBsonId;
function head_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
}
exports.head_script = head_script;
function body_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
}
exports.body_script = body_script;
function del_script(src) {
    const el = document.querySelector('script[src=\'' + src + '\']');
    if (el) {
        el.remove();
    }
}
exports.del_script = del_script;
function head_link(href) {
    if (document.querySelector('link[href=\'' + href + '\']'))
        return;
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
}
exports.head_link = head_link;
function body_link(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.body.appendChild(link);
}
exports.body_link = body_link;
function del_link(href) {
    const el = document.querySelector('link[href="' + href + '"]');
    if (el) {
        el.remove();
    }
}
exports.del_link = del_link;
function setPropertyEmbeddedError(doc, propName, error) {
    if (error) {
        doc._ = doc._ || {};
        doc._[types_1.Constants.errorEmbedProperty] = doc._[types_1.Constants.errorEmbedProperty] || {};
        doc._[types_1.Constants.errorEmbedProperty][propName] = error;
    }
    else if (doc && doc._ && doc._[types_1.Constants.errorEmbedProperty]) {
        delete doc._[types_1.Constants.errorEmbedProperty][propName];
    }
}
exports.setPropertyEmbeddedError = setPropertyEmbeddedError;
function getPropertyEmbedError(doc, propName) {
    if (doc && doc._ && doc._[types_1.Constants.errorEmbedProperty])
        return doc._[types_1.Constants.errorEmbedProperty][propName];
    else
        return null;
}
exports.getPropertyEmbedError = getPropertyEmbedError;
function load(href, pushState = false) {
    if (exports.glob.dirty) {
        notify($t('save-before'), types_2.LogType.Warning);
        return;
    }
    if (pushState)
        history.pushState(null, null, href);
    ajax(setQs('m', types_2.RequestMode.inline, false, href), null, null, handleResponse, err => notify(err));
}
exports.load = load;
function ajax(url, data, config, done, fail) {
    config = config || {};
    let headers = {};
    if (exports.glob.config.host) {
        url = joinUri(exports.glob.config.host, url);
    }
    let params = { url, data, headers, withCredentials: true };
    if (config.method) {
        params.method = config.method;
    }
    else {
        params.method = data ? types_2.WebMethod.post : types_2.WebMethod.get;
    }
    if (data) { // extract files raw data
        let formData = null;
        for (let key in data) {
            if (!data[key])
                continue;
            let itemArray = Array.isArray(data[key]) ? data[key] : [data[key]];
            for (let item of itemArray) {
                if (item._ && item._.rawData) {
                    formData = formData || new FormData();
                    let blob = item._.rawData;
                    formData.append('files[]', blob, item.name);
                    delete item._.rawData;
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
        if (res.status && res.status !== types_2.StatusCode.Ok) {
            fail({ code: res.status, message: res.statusText });
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
        stopProgress();
        console.error(`error on ajax '${url}'`, err);
        if (err.response && err.response.data && err.response.data.message) {
            fail({ message: err.response.data.message, code: err.response.data.code });
        }
        else if (err.response && err.response.data) {
            fail({ message: err.response.data, code: err.response.status });
        }
        else {
            fail({ message: err.toString(), code: types_2.StatusCode.UnknownError });
        }
    });
}
exports.ajax = ajax;
function startProgress() {
    exports.glob.progress = 0;
    setTimeout(() => {
        if (exports.glob.progress != null) {
            exports.glob.progress = 1;
            setTimeout(() => exports.glob.progress = exports.glob.progress ? 50 : 0, 0);
            setTimeout(() => exports.glob.progress = exports.glob.progress ? 95 : 0, 1000);
        }
    }, types_1.Constants.delayToStartProgressBar);
}
function stopProgress() {
    exports.glob.progress = null;
}
function registerComponents(vue, components) {
    const requireComponent = require.context('./components', false, /\.vue$/);
    requireComponent.keys().forEach(fileName => {
        const componentConfig = requireComponent(fileName);
        const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
        vue_1.default.component(componentName, componentConfig.default || componentConfig);
    });
    // vue.component('Function', require("@/components/Function.vue").default);
    // vue.component('Panel', require("@/components/Panel.vue").default);
    // vue.component('Modal', require("@/components/Modal.vue").default);
    // vue.component('Prop', require("@/components/Prop.vue").default);
    // vue.component('ObjectView', require("@/components/ObjectView.vue").default);
    // vue.component('DocumentEditor', require("@/components/DocumentEditor.vue").default);
    // vue.component('FormElem', require("@/components/FormElem.vue").default);
    // vue.component('GridView', require("@/components/GridView.vue").default);
    // vue.component('DetailsView', require("@/components/DetailsView.vue").default);
    // vue.component('CheckBox', require("@/components/CheckBox.vue").default);
    // vue.component('LogTerminal', require("@/components/LogTerminal.vue").default);
    // vue.component('ApiDoc', require("@/components/ApiDoc.vue").default);
    // vue.component('SysDashboard', require("@/components/SysDashboard.vue").default);
    // vue.component('FormView', require("@/components/FormView.vue").default);
    if (components) {
        for (let name in components) {
            vue.component(name, components[name]);
        }
    }
}
function startVue(res, app, components) {
    try {
        handleWindowEvents();
        vue_1.default.use(vuex_1.default);
        store = createStore();
        handleResponse(res);
        if (typeof io != "undefined")
            exports.glob.socket = io();
        Object.assign(vue_1.default.config, { productionTip: false, devtools: true });
        vue_1.default.prototype.glob = exports.glob;
        vue_1.default.prototype.$t = $t;
        vue_1.default.config.productionTip = false;
        vue_1.default.directive('focus', {
            inserted(el, binding) {
                if (binding.value)
                    el.focus();
            }
        });
        if (exports.glob.config.rtl)
            $("html").attr("dir", "rtl");
        registerComponents(vue_1.default, components);
        new vue_1.default({ data: exports.glob, store, render: h => h(app || App_vue_1.default) }).$mount('#app');
    }
    catch (err) {
        console.error(err);
        notify("<strong>Starting Vue failed:</strong> " + err.message, types_2.LogType.Fatal);
    }
}
function commitFileAction(store, action) {
    store.commit('_commitFileAction', action);
}
function _commitFileAction(state, e) {
    e.item[e.prop.name] = e.val || null;
    exports.glob.dirty = true;
}
function dispatchFileAction(vue, e) {
    vue.$store.dispatch('_dispatchFileAction', e);
}
exports.dispatchFileAction = dispatchFileAction;
function _dispatchFileAction(store, e) {
    if (e.item._.ref == null)
        throw "ref is empty!";
    let modify = {
        ref: e.item._.ref,
        type: types_1.ChangeType.EditFileProp,
        data: {},
        state: e.item,
    };
    exports.glob.modifies.push(modify);
    modify.data[e.prop.name] = e.val || null;
    commitFileAction(store, e);
}
function commitReloadData(store, data) {
    store.commit('_commitReloadData', data);
}
function _commitReloadData(state, data) {
    state.data = data;
}
function clearModifies() {
    exports.glob.dirty = false;
    exports.glob.modifies = [];
}
exports.clearModifies = clearModifies;
function commitStoreChange(store, change) {
    store.commit('_commitStoreChange', change);
}
exports.commitStoreChange = commitStoreChange;
function _commitStoreChange(state, change) {
    let ref = change.uri;
    switch (change.type) {
        case types_1.ChangeType.EditProp:
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
        case types_1.ChangeType.InsertItem:
            state.data[ref].push(change.item);
            break;
        case types_1.ChangeType.DeleteItem:
            state.data[ref].splice(state.data[ref].indexOf(change.item), 1);
            break;
    }
    change.vue.$forceUpdate();
}
function commitServerChangeResponse(store, modify, res) {
    store.commit('_commitServerChangeResponse', { modify, res });
}
exports.commitServerChangeResponse = commitServerChangeResponse;
function _commitServerChangeResponse(store, arg) {
    switch (arg.modify.type) {
        case types_1.ChangeType.EditProp:
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            break;
        case types_1.ChangeType.InsertItem:
            if (arg.modify.state._id != arg.res._reqId)
                notify(`data save error: state id '${arg.modify.state._id}' and request id '${arg.res._reqId}' are not same`, types_2.LogType.Error);
            else
                delete arg.res._reqId;
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            //Object.assign(arg.modify.state, arg.res);
            break;
    }
}
function sort(array, prop) {
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
}
exports.sort = sort;
function commitReorderItems(store, items, up, uri, item) {
    store.commit('_commitReorderItems', { items, up, uri, item });
}
exports.commitReorderItems = commitReorderItems;
function _commitReorderItems(store, arg) {
    let { items, up, uri, item } = arg;
    let index = items.indexOf(item);
    if ((up && index == 0) || (!up && index == items.length - 1))
        return;
    exports.glob.dirty = true;
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
function modifyOrder(item, uri) {
    let modify = exports.glob.modifies.find(m => m.state == item && (m.type == types_1.ChangeType.InsertItem || m.type == types_1.ChangeType.EditProp));
    if (!modify) {
        modify = { ref: uri + "/" + getBsonId(item), type: types_1.ChangeType.EditProp, data: {}, state: item };
        exports.glob.modifies.push(modify);
    }
    modify.data._z = item._z;
}
function dispatchStoreModify(vue, change) {
    vue.$store.dispatch('_dispatchStoreModify', change);
}
exports.dispatchStoreModify = dispatchStoreModify;
function _dispatchStoreModify(store, change) {
    let ref = change.uri;
    switch (change.type) {
        case types_1.ChangeType.EditProp: {
            let modify;
            if (getQs("n")) {
                let data = { _id: change.item._id };
                modify = exports.glob.modifies.find(m => m.state == change.item);
                if (!modify)
                    modify = { ref, type: types_1.ChangeType.InsertItem, data, state: change.item };
                exports.glob.modifies.push(modify);
            }
            else {
                modify = exports.glob.modifies.find(m => m.state == change.item && (m.type == types_1.ChangeType.InsertItem || m.type == types_1.ChangeType.EditProp));
                if (!modify) {
                    modify = { ref, type: types_1.ChangeType.EditProp, data: {}, state: change.item };
                    exports.glob.modifies.push(modify);
                }
            }
            modify.data[change.prop.name] = change.value;
            break;
        }
        case types_1.ChangeType.InsertItem: {
            let data = { _id: change.item._id };
            if (change.item._z)
                data["_z"] = change.item._z;
            exports.glob.modifies.push({ ref, type: types_1.ChangeType.InsertItem, data, state: change.item });
            break;
        }
        case types_1.ChangeType.DeleteItem: {
            ref = ref + "/" + getBsonId(change.item);
            let modify = exports.glob.modifies.find(m => m.state == change.item);
            if (modify) {
                exports.glob.modifies.splice(exports.glob.modifies.indexOf(modify), 1);
                if (modify.type != types_1.ChangeType.InsertItem) // delete before saving in server
                    exports.glob.modifies.push({ state: change.item, ref, type: types_1.ChangeType.DeleteItem });
            }
            else
                exports.glob.modifies.push({ state: change.item, ref, type: types_1.ChangeType.DeleteItem });
            break;
        }
    }
    exports.glob.dirty = exports.glob.modifies.length > 0;
    commitStoreChange(store, change);
}
function dispatchRequestServerModify(store, done) {
    store.dispatch('_dispatchRequestServerModify', done);
}
exports.dispatchRequestServerModify = dispatchRequestServerModify;
function markDown(html) {
    return marked(html).replace(/^\<p\>|\<\/p\>\s*$/g, "");
}
exports.markDown = markDown;
function _dispatchRequestServerModify(store, done) {
    if (exports.glob.modifies.length == 0) {
        notify($t('saved'), types_2.LogType.Debug);
        exports.glob.dirty = false;
        return done();
    }
    let modify = exports.glob.modifies.shift();
    //main.log(modify.type, modify.ref, modify.data);
    let method = types_2.WebMethod.patch;
    switch (modify.type) {
        case types_1.ChangeType.InsertItem:
            method = types_2.WebMethod.post;
            break;
        case types_1.ChangeType.DeleteItem:
            method = types_2.WebMethod.del;
            break;
    }
    ajax(prepareServerUrl(modify.ref), modify.data, { method }, (res) => {
        res.data = flat2recursive(res.data);
        commitServerChangeResponse(store, modify, res.data);
        if (getQs("n")) {
            clearModifies();
            load("/" + modify.ref + "/" + res.data._id.$oid, true);
        }
        else if (res.redirect && exports.glob.modifies.length == 0)
            return handleResponseRedirect(res);
        else
            dispatchRequestServerModify(store, done);
    }, (err) => {
        exports.glob.modifies.unshift(modify);
        done(err);
        notify(err);
    });
}
function createStore() {
    return new vuex_1.default.Store({
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
function start(app, components) {
    // console.log('starting ...');
    const mainState = $('#main-state').html();
    const res = parse(mainState);
    if (res)
        startVue(res, app, components);
    else {
        let uri = setQs('m', types_2.RequestMode.inlineDev, false, (location.pathname && location.pathname != '/') ? location.pathname : types_1.Constants.defaultAddress);
        uri = setQs('t', Math.random(), false, uri);
        if (getQs(types_1.Constants.search_locale))
            uri = setQs(types_1.Constants.search_locale, getQs(types_1.Constants.search_locale), false, uri);
        console.log(`loading main-state async from '${uri}' ...`);
        axios.get(uri, { withCredentials: true }).then(res => {
            if (res.data)
                startVue(res.data, app, components);
            else
                console.error(res);
        }).catch(err => {
            console.error(err);
            notify("Connecting to proxy server failed! " + err.message, types_2.LogType.Fatal);
        });
    }
}
exports.start = start;
window["start"] = start;
exports.default = {};
//# sourceMappingURL=main.js.map