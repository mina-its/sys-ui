import Vue from 'vue';
import App from './App.vue';
import { Constants, Global } from '@/types';
import { Keys, LogType, StatusCode, RequestMode, WebMethod } from '../../sys/src/types';
export let glob = new Global();
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
export function initState(res) {
    //log("load res: ", res.data);
    let title = '';
    if (res.form) {
        glob.form = res.form;
        title = glob.form.title;
    }
    document.title = title;
    glob.headFuncs = [];
    // glob.form.toolbar = false;
    // if (glob.config) glob.config = res.config;
    let data = res.data || {};
    for (const prop in data) {
        vueResetProperties(data[prop], prop, true);
    }
    glob.data = data;
    $('.details-view').scrollTop(0);
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
export function vueResetProperties(data, name, resetStatus) {
    let meta = data._;
    if (Array.isArray(data)) {
        if (resetStatus) {
            data.forEach(item => item._status = null);
        }
    }
    else {
        if (data._id < 0) // new item
         {
            glob.dirty = true;
        }
    }
    if (!meta || !meta.dec || !meta.dec.properties) {
        return;
    }
    for (const prop of meta.dec.properties) {
        if (Array.isArray(data)) {
            data.forEach(item => setUndefinedToNull(item, prop));
        }
        else {
            setUndefinedToNull(data, prop);
        }
    }
}
function validateData(data, ref) {
    let meta = data._;
    let requiredProps = meta.dec.properties.filter(p => p.required);
    for (const prop of requiredProps) {
        if (data[prop.name] == null) {
            notify(`Property '${prop.name}' is required.`, LogType.Warning);
            // if (!Array.isArray(glob.data[ref]))
            // 	data._error = `Property '${prop.name}' is required.`;
            return false;
        }
    }
    return true;
}
export function validate() {
    for (const ref in glob.data) {
        if (Array.isArray(glob.data[ref])) {
            for (const item of glob.data[ref]) {
                if (!validateData(item, ref)) {
                    return false;
                }
            }
        }
        else if (!validateData(glob.data[ref], ref)) {
            return false;
        }
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
    if (res.redirect) {
        handleResponseRedirect(res);
    }
    else if (res.message) {
        notify(res.message, LogType.Info);
        // resetToolbar();
        // history.pushState(null, null, "/");
    }
    else {
        initState(res);
    }
}
export function setPropTextValue(meta, data, val) {
    let locale = getQs('e') || 'en';
    let oldValue = data[meta.name];
    if (meta.text && meta.text.multiLanguage) {
        if (locale) {
            if (typeof oldValue == 'string') {
                data[meta.name] = { 'en': oldValue };
            }
            else {
                data[meta.name] = data[meta.name] || {};
            }
            data[meta.name][locale] = val;
        }
        else {
            if (typeof oldValue == 'object') {
                data[meta.name]['en'] = val;
            }
            else {
                data[meta.name] = val;
            }
        }
    }
    else {
        data[meta.name] = val;
    }
}
export function getPropTextValue(meta, data) {
    if (meta.formula) {
        return evalExpression(this.doc, meta.formula);
    }
    if (!data) {
        throw 'prop-text doc is null!';
    }
    let val = data[meta.name];
    if (typeof val == 'object') {
        let locale = getQs('e') || 'en';
        return val[locale];
    }
    else {
        return val;
    }
}
export function getPropReferenceValue(meta, data) {
    if (!data) {
        return '';
    }
    let val = data[meta.name];
    if (!val) {
        return '';
    }
    if (meta.isList) {
        if (!Array.isArray(val)) {
            val = [val];
        }
        let values = [];
        for (const valItem of val) {
            let item = meta._.items.find(i => i.ref == valItem);
            if (!item) {
                values.push('...');
            }
            else {
                values.push(item.title);
            }
        }
        return values.join(', ');
    }
    else {
        let item = meta._.items.find(i => i.ref == val);
        if (!item) {
            return '...';
        }
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
    for (const item of items) {
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
function handleCmenuKeys(e) {
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
export function changeLocale(locale) {
    location.href = setQs('e', locale, true);
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
    let flatJson = JSON.parse(str);
    return flat2recursive(flatJson);
}
export function flat2recursive(flatJson) {
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
    window.dispatchEvent(new CustomEvent('notify', { detail: { message, type } }));
}
export function question(questionId, message, options, select) {
    window.dispatchEvent(new CustomEvent('question', { detail: { questionId, message, options, select } }));
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
    if (this.state.dirty) {
        notify($t('save-before'), LogType.Warning);
        return;
    }
    this.ajax(setQs('m', RequestMode.partial, false, href), null, null, handleResponse, err => notify(err));
}
export function getItemDec(item) {
    if (!item || !item._) {
        return null;
    }
    return item._.dec;
}
export function ajax(url, data, config, done, fail) {
    const params = { url, data };
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
        params.headers = { 'Content-Type': 'multipart/form-data' };
    }
    fail = fail || notify;
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
(function start() {
    const mainState = $('#main-state').html();
    const res = mainState ? parse(mainState) : {};
    console.assert(res.config, 'config must be ready in initial state.');
    glob.config = res.config;
    if (res.message) {
        notify(res);
    }
    else {
        initState(res);
    }
    Object.assign(Vue.config, { productionTip: false, devtools: true });
    Vue.directive('focus', {
        inserted(el, binding) {
            if (binding.value) {
                el.focus();
            }
        }
    });
    Vue['glob'] = Vue.prototype.glob = glob;
    new Vue({ render: h => h(App) }).$mount('#app');
})();
//# sourceMappingURL=main.js.map