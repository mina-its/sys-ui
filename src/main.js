"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var App_vue_1 = require("./App.vue");
var types_1 = require("./types");
var types_2 = require("../../sys/src/types");
var axios = require('axios').default;
exports.glob = new types_1.Global();
function $t(text) {
    return typeof (text) == 'object' ? text[exports.glob.config.locale] || Object.values(text)[0] : text;
    // if (text[pack + "." + key]) return text[pack + "." + key];
    //
    // console.warn(`Warning: text '${pack}.${key}' not found`);
    // return key.replace(/-/g, " ");
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
        console.error("Evaluating '" + expression + "' failed! this:", $this, 'Error:', ex.message);
    }
}
exports.evalExpression = evalExpression;
function vueResetFormData(form) {
    if (!form.dataset || !form.declarations)
        return;
    var _loop_1 = function (ref) {
        var data = form.dataset[ref];
        var dec = form.declarations[ref];
        if (!data || !dec)
            return "continue";
        data._ = data._ || {};
        var meta = data._;
        meta.dec = dec;
        if (Array.isArray(data))
            data.forEach(function (data) { return meta.marked = null; });
        var _loop_2 = function (prop) {
            if (Array.isArray(data)) {
                data.forEach(function (item) { return setUndefinedToNull(item, prop); });
            }
            else {
                setUndefinedToNull(data, prop);
            }
        };
        for (var _i = 0, _a = dec.properties; _i < _a.length; _i++) {
            var prop = _a[_i];
            _loop_2(prop);
        }
    };
    for (var ref in form.dataset) {
        _loop_1(ref);
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
function validateData(data, ref) {
    var meta = data._;
    var requiredProps = meta.dec.properties.filter(function (p) { return p.required; });
    for (var _i = 0, requiredProps_1 = requiredProps; _i < requiredProps_1.length; _i++) {
        var prop = requiredProps_1[_i];
        if (data[prop.name] == null) {
            notify("Property '" + prop.name + "' is required.", types_2.LogType.Warning);
            // if (!Array.isArray(glob.glob.form.dataset[ref]))
            // 	data._error = `Property '${prop.name}' is required.`;
            return false;
        }
    }
    return true;
}
function validate() {
    for (var ref in exports.glob.form.dataset) {
        if (Array.isArray(exports.glob.form.dataset[ref])) {
            for (var _i = 0, _a = exports.glob.form.dataset[ref]; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!validateData(item, ref)) {
                    return false;
                }
            }
        }
        else if (!validateData(exports.glob.form.dataset[ref], ref)) {
            return false;
        }
    }
    return true;
}
exports.validate = validate;
function someProps(prop) {
    return Array.isArray(prop.properties) && prop.properties.length;
}
exports.someProps = someProps;
function commitNewItem() {
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
exports.commitNewItem = commitNewItem;
function prepareServerUrl(ref) {
    ref = '/' + ref;
    var locale = getQs('e');
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
    res = flat2recursive(res);
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, types_2.LogType.Info);
    else if (res.form) {
        exports.glob.form = res.form;
        document.title = exports.glob.form.title;
        exports.glob.headFuncs = [];
        vueResetFormData(exports.glob.form);
        $('.details-view').scrollTop(0);
    }
    else {
        notify("WHAT should I do now?", types_2.LogType.Warning);
        console.log(res);
    }
}
exports.handleResponse = handleResponse;
function setPropTextValue(prop, data, val) {
    var locale = getQs('e') || 'en';
    var oldValue = data[prop.name];
    if (prop.text && prop.text.multiLanguage) {
        if (locale) {
            if (typeof oldValue == 'string')
                data[prop.name] = { 'en': oldValue };
            else
                data[prop.name] = data[prop.name] || {};
            data[prop.name][locale] = val;
        }
        else {
            if (oldValue && typeof oldValue == 'object')
                data[prop.name]['en'] = val;
            else
                data[prop.name] = val;
        }
    }
    else
        data[prop.name] = val;
}
exports.setPropTextValue = setPropTextValue;
function getPropTextValue(meta, data) {
    if (meta.formula)
        return evalExpression(this.doc, meta.formula);
    if (!data)
        throw 'prop-text doc is null!';
    var val = data[meta.name];
    if (val && typeof val == 'object') {
        var locale = getQs('e') || 'en';
        return val[locale];
    }
    else
        return val;
}
exports.getPropTextValue = getPropTextValue;
function getPropReferenceValue(meta, data) {
    if (!data)
        return '';
    var val = data[meta.name];
    if (!val)
        return '';
    if (meta.isList) {
        if (!Array.isArray(val))
            val = [val];
        var values = [];
        var _loop_3 = function (valItem) {
            var item = meta._.items.find(function (i) { return i.ref == valItem; });
            if (!item)
                values.push('...');
            else
                values.push(item.title);
        };
        for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
            var valItem = val_1[_i];
            _loop_3(valItem);
        }
        return values.join(', ');
    }
    else {
        var item = meta._.items.find(function (i) { return i.ref == val; });
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
    else if (!$.isEmptyObject(res.data)) {
        var form_1 = '';
        $.each(res.data, function (key, value) {
            form_1 += '<input type="hidden" name="' + key + '" value="' + value + '">';
        });
        $('<form action="' + res.redirect + '" method="POST">' + form_1 + '</form>').appendTo('body').submit();
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
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        item.hover = item.hover || false;
    }
    if (!items.find(function (i) { return i.hover; })) {
        if (!items[0].title) {
            items[0].hover = false;
            items[1].hover = true;
        }
        else {
            items[0].hover = true;
        }
    }
    exports.glob.cmenu = { show: true, items: items, handler: handler, state: state, top: 0, left: 0, right: 0, bottom: 0, event: event };
}
exports.showCmenu = showCmenu;
function hideCmenu() {
    exports.glob.cmenu.show = false;
}
exports.hideCmenu = hideCmenu;
function handleCmenuKeys(e) {
    switch (e.which) {
        case types_2.Keys.tab:
        case types_2.Keys.esc:
            exports.glob.cmenu.handler(exports.glob.cmenu.state, null);
            hideCmenu();
            break;
        case types_2.Keys.enter: {
            var item = exports.glob.cmenu.items.find(function (i) { return i.hover; });
            if (item) {
                exports.glob.cmenu.handler(exports.glob.cmenu.state, item);
                hideCmenu();
            }
            break;
        }
        case types_2.Keys.down: {
            var item = exports.glob.cmenu.items.find(function (i) { return i.hover; });
            if (!item) {
                exports.glob.cmenu.items[0].hover = true;
            }
            else {
                var index = exports.glob.cmenu.items.indexOf(item);
                if (index < exports.glob.cmenu.items.length - 1) {
                    exports.glob.cmenu.items[index].hover = false;
                    exports.glob.cmenu.items[index + 1].hover = true;
                }
            }
            break;
        }
        case types_2.Keys.up: {
            var item = exports.glob.cmenu.items.find(function (i) { return i.hover; });
            if (!item) {
                exports.glob.cmenu.items[exports.glob.cmenu.items.length - 1].hover = true;
            }
            else {
                var index = exports.glob.cmenu.items.indexOf(item);
                if (index > 0) {
                    exports.glob.cmenu.items[index].hover = false;
                    exports.glob.cmenu.items[index - 1].hover = true;
                }
            }
            break;
        }
    }
}
function changeLocale(locale) {
    location.href = setQs('e', locale, true);
}
exports.changeLocale = changeLocale;
function getQs(key) {
    var search = location.search;
    var query = new URLSearchParams(search);
    return query.get(key);
}
exports.getQs = getQs;
function setQs(key, value, fullPath, href) {
    var search, el;
    if (href) {
        el = document.createElement('a');
        el.href = href;
        search = el.search;
    }
    else {
        search = location.search;
    }
    var query = new URLSearchParams(search);
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
    var dependents = dec.properties.filter(function (p) { return p.dependsOn == prop.name; });
    var _loop_4 = function (prop_1) {
        instance[prop_1.name] = null;
        if (prop_1._.items) {
            prop_1._.items = null;
            var data = { prop: prop_1, instance: instance };
            ajax('/getPropertyReferenceValues', data, null, function (res) { return prop_1._.items = res.data; }, function (err) { return notify(err); });
        }
    };
    for (var _i = 0, dependents_1 = dependents; _i < dependents_1.length; _i++) {
        var prop_1 = dependents_1[_i];
        _loop_4(prop_1);
    }
}
exports.checkPropDependencyOnChange = checkPropDependencyOnChange;
function parse(str) {
    if (!str)
        return null;
    var flatJson = JSON.parse(str);
    return flat2recursive(flatJson);
}
function flat2recursive(flatJson) {
    var keys = {};
    var findKeys = function (obj) {
        if (obj && obj._0) {
            keys[obj._0] = obj;
            delete obj._0;
        }
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                findKeys(obj[key]);
            }
        }
    };
    var seen = new WeakSet();
    var replaceRef = function (obj) {
        if (seen.has(obj)) {
            return;
        }
        seen.add(obj);
        for (var key in obj) {
            var val = obj[key];
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
function refreshFileGallery(file, done) {
    openFileGallery(exports.glob.fileGallery.drive, file, exports.glob.fileGallery.path, exports.glob.fileGallery.fixedPath, exports.glob.fileGallery.fileSelectCallback, done);
}
exports.refreshFileGallery = refreshFileGallery;
function openFileGallery(drive, file, path, fixedPath, fileSelectCallback, done) {
    exports.glob.fileGallery = {
        list: [],
        loading: true,
        drive: drive,
        file: file,
        path: path || '',
        fixedPath: fixedPath,
        selectable: true,
        fileSelectCallback: fileSelectCallback
    };
    $('#file-gallery').modal('show');
    ajax('/getFileGallery?m=1', { drive: drive._id, path: path }, {}, function (res) {
        exports.glob.fileGallery.loading = false;
        exports.glob.fileGallery.uri = res.data.uri;
        exports.glob.fileGallery.list = res.data.list;
        exports.glob.fileGallery.selected = exports.glob.fileGallery.list.find(function (l) { return l.name === exports.glob.fileGallery.file; });
        if (done) {
            done();
        }
    });
}
exports.openFileGallery = openFileGallery;
function component(name, props, params) {
    params.props = props;
    vue_1.default.component(name, params);
}
exports.component = component;
function log() {
    var message = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        message[_i] = arguments[_i];
    }
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
function joinUri() {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    var uri = '';
    for (var _a = 0, parts_1 = parts; _a < parts_1.length; _a++) {
        var part = parts_1[_a];
        uri += '/' + (part || '').replace(/^\//, '').replace(/\/$/, '');
    }
    return uri.substr(1);
}
exports.joinUri = joinUri;
function notify(content, type, params) {
    if (!content) {
        return;
    }
    var message = typeof content === 'string' ? content : content.message;
    if (!type) {
        if (typeof content !== 'string') {
            type = content.code && content.code !== types_2.StatusCode.Ok ? types_2.LogType.Error : types_2.LogType.Info;
        }
        else {
            type = types_2.LogType.Info;
        }
    }
    window.dispatchEvent(new CustomEvent(types_1.Constants.notifyEvent, { detail: { message: message, type: type } }));
}
exports.notify = notify;
function question(questionId, message, options, select) {
    window.dispatchEvent(new CustomEvent(types_1.Constants.questionEvent, { detail: { questionId: questionId, message: message, options: options, select: select } }));
    $('#question-box').modal('show');
}
exports.question = question;
function getBsonId(item) {
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
exports.getBsonId = getBsonId;
function head_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.head.appendChild(script);
}
exports.head_script = head_script;
function body_script(src) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    document.body.appendChild(script);
}
exports.body_script = body_script;
function del_script(src) {
    var el = document.querySelector('script[src=\'' + src + '\']');
    if (el) {
        el.remove();
    }
}
exports.del_script = del_script;
function head_link(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    var link = document.createElement('link');
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
    var link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.body.appendChild(link);
}
exports.body_link = body_link;
function del_link(href) {
    var el = document.querySelector('link[href="' + href + '"]');
    if (el) {
        el.remove();
    }
}
exports.del_link = del_link;
function setPropertyEmbeddedError(doc, propName, error) {
    console.assert(doc, "setPropertyEmbeddedError doc is empty, prop:" + propName + "!");
    doc._ = doc._ || {};
    doc._[propName] = doc._[propName] || {};
    doc._[propName].err = error;
}
exports.setPropertyEmbeddedError = setPropertyEmbeddedError;
function load(href) {
    if (exports.glob.dirty) {
        notify($t('save-before'), types_2.LogType.Warning);
        return;
    }
    ajax(setQs('m', types_2.RequestMode.inline, false, href), null, null, handleResponse, function (err) { return notify(err); });
}
exports.load = load;
function ajax(url, data, config, done, fail) {
    var headers = {};
    if (exports.glob.config.host) {
        url = joinUri(exports.glob.config.host, url);
    }
    var params = { url: url, data: data, headers: headers, withCredentials: true };
    if (config && config.method) {
        params.method = config.method;
    }
    else {
        params.method = data ? types_2.WebMethod.post : types_2.WebMethod.get;
    }
    if (data && data._files) {
        params.data = new FormData();
        for (var _i = 0, _a = data._files; _i < _a.length; _i++) {
            var file = _a[_i];
            params.data.append('files[]', file, file['name']);
        }
        params.data.append('data', JSON.stringify(data));
        params.headers['Content-Type'] = 'multipart/form-data';
    }
    fail = fail || notify;
    // console.log(params);
    axios(params).then(function (res) {
        if (res.code && res.code !== types_2.StatusCode.Ok) {
            fail({ code: res.code, message: res.message });
        }
        else {
            try {
                done(res.data);
            }
            catch (ex) {
                notify("error on handling ajax response: " + ex.message);
                console.error(res, ex);
            }
        }
    }).catch(function (err) {
        console.error("error on ajax '" + url + "'", err);
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
function registerComponents() {
    vue_1.default.component('Function', require("@/components/Function.vue").default);
    vue_1.default.component('Panel', require("@/components/Panel.vue").default);
    vue_1.default.component('Modal', require("@/components/Modal.vue").default);
    vue_1.default.component('Prop', require("@/components/Prop.vue").default);
    vue_1.default.component('ObjectView', require("@/components/ObjectView.vue").default);
    vue_1.default.component('GridView', require("@/components/GridView.vue").default);
    vue_1.default.component('DetailsView', require("@/components/DetailsView.vue").default);
}
function start() {
    console.log('starting ...');
    var startVue = function (res) {
        handleResponse(res);
        exports.glob.config = res.config;
        Object.assign(vue_1.default.config, { productionTip: false, devtools: true });
        vue_1.default.directive('focus', {
            inserted: function (el, binding) {
                if (binding.value)
                    el.focus();
            }
        });
        registerComponents();
        vue_1.default['glob'] = vue_1.default.prototype.glob = exports.glob;
        window['glob'] = exports.glob;
        new vue_1.default({ data: exports.glob, render: function (h) { return h(App_vue_1.default); } }).$mount('#app');
    };
    var mainState = $('#main-state').html();
    var res = parse(mainState);
    if (res) {
        startVue(res);
    }
    else { // load main-state async
        var host = "http://localhost";
        var uri = host + setQs('m', types_2.RequestMode.inlineDev, true) + location.hash;
        console.log(uri);
        axios.get(uri, { withCredentials: true }).then(function (res) {
            if (res.data)
                startVue(res.data);
            else
                console.error(res);
        }).catch(function (err) { return console.error(err); });
    }
}
start();
