"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.markDown = exports.dispatchRequestServerModify = exports.dispatchStoreModify = exports.commitReorderItems = exports.sort = exports.commitServerChangeResponse = exports.commitStoreChange = exports.clearModifies = exports.ajax = exports.loadNotes = exports.load = exports.call = exports.getPropertyEmbedError = exports.setPropertyEmbeddedError = exports.delLink = exports.loadBodyLink = exports.addHeadLink = exports.delScript = exports.loadBodyScript = exports.loadHeadScript = exports.question = exports.notify = exports.joinUri = exports.toFriendlyFileSizeString = exports.invoke = exports.log = exports.openFileGallery = exports.getNewItemTitle = exports.refreshFileGallery = exports.browseFile = exports.checkPropDependencyOnChange = exports.setQs = exports.getQs = exports.handleCmenuKeys = exports.handleImagesPreview = exports.pushToGridViewRecentList = exports.newID = exports.hideCmenu = exports.showCmenu = exports.isRtl = exports.handleResponseRedirect = exports.showPropRefMenu = exports.getPropReferenceValue = exports.equalID = exports.getPropTextValue = exports.digitGroup = exports.handleResponse = exports.onlyUnique = exports.loadObjectViewData = exports.prepareServerUrl = exports.someProps = exports.validate = exports.getDec = exports.assignNullToEmptyProperty = exports.processThisExpression = exports.evalExpression = exports.clone = exports.$t = exports.getText = exports.getBsonValue = exports.stringify = exports.parse = exports.glob = void 0;
const tslib_1 = require("tslib");
let index = {
    // Vuex
    "Modify                         ": dispatchStoreModify,
    "Apply                          ": _dispatchRequestServerModify,
    // Vue
    "Registers Components           ": registerComponents,
    "Reset Form Data                ": vueResetFormData,
    "Start Vue                      ": startVue,
    // Global
    "Handle Response                ": handleResponse,
    "Handle Window Events           ": handleWindowEvents,
    "Load                           ": load,
    "Ajax                           ": ajax,
};
const bson_util_1 = require("bson-util");
Object.defineProperty(exports, "getBsonValue", { enumerable: true, get: function () { return bson_util_1.getBsonValue; } });
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return bson_util_1.parse; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return bson_util_1.stringify; } });
const vue_1 = tslib_1.__importDefault(require("vue"));
const vuex_1 = tslib_1.__importDefault(require("vuex"));
const types_1 = require("./types");
const types_2 = require("../../sys/src/types");
const App_vue_1 = tslib_1.__importDefault(require("./App.vue"));
const pluralize = require("pluralize");
exports.glob = window["__glob"] || new types_1.Global();
window["__glob"] = exports.glob;
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
            text = exports.glob.texts["sys." + text] || text.replace(/-/g, " ");
            if (typeof text == "string")
                return text;
        }
        else {
            return text.replace(/^.+\./, "").replace(/-/g, " ");
        }
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
function clone(obj) {
    return bson_util_1.parse(bson_util_1.stringify(obj, true), true, types_1.ID);
}
exports.clone = clone;
function socketConnect() {
    if (exports.glob.config.interactive && typeof io != "undefined") {
        exports.glob.socket = io({ autoConnect: true });
        exports.glob.socket.on('cmd', handleSocketCommand);
        // glob.socket.on('disconnect', () => {
        //     console.log('Socket disconnected!');
        // });
        exports.glob.socket.on('connect', () => {
            console.log('Socket connected!');
        });
    }
}
function handleSocketCommand(command, ...args) {
    switch (command) {
        case types_2.ClientCommand.Log:
            exports.glob.logs.push({ message: args[0], type: args[1], ref: args[2] });
            break;
        case types_2.ClientCommand.PingAck:
            console.log('socket is ready');
            break;
        case types_2.ClientCommand.Notification:
            notify(args[0], args[1]);
            break;
        case types_2.ClientCommand.Question:
            question(args[0] /*title*/, args[1] /*message*/, args[2] /*buttons*/, { questionId: args[3] }, (ref) => {
                exports.glob.socket.emit('cmd', types_2.ClientCommand.Answer, args[3], ref);
            });
            break;
        case types_2.ClientCommand.FunctionDone:
            exports.glob.logs.push({ message: "done!", type: types_2.LogType.Info });
            exports.glob.logs.push(null);
            break;
        case types_2.ClientCommand.Download:
            window.open(args[0]);
            break;
        case types_2.ClientCommand.FunctionFailed:
            exports.glob.logs.push({ message: args[0], type: types_2.LogType.Error });
            exports.glob.logs.push(null);
            break;
    }
}
function evalExpression($this, expression) {
    try {
        if (expression == null)
            return null;
        return eval(expression.replace(/\bthis\b/g, '$this'));
    }
    catch (ex) {
        console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
    }
}
exports.evalExpression = evalExpression;
function processThisExpression($this, expression) {
    try {
        if (expression == null)
            return null;
        let match;
        let reg = /\bthis\.(\w+)/;
        while ((match = reg.exec(expression)) !== null) {
            let propName = match[1];
            let propReg = new RegExp(`\\bthis\\.${propName}`, "g");
            let val = bson_util_1.getBsonValue($this[propName]);
            let valStr = JSON.stringify(val);
            expression = expression.replace(propReg, valStr);
        }
        return expression;
    }
    catch (ex) {
        console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
    }
}
exports.processThisExpression = processThisExpression;
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
        res.form.elems.forEach(elem => elem.id = elem.id || types_1.ID.generateByBrowser()); // needs for refreshing form while cancel changes
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
                    let meta = setDataMeta(ref + "/" + item._id, item, dec);
                    meta.marked = null;
                });
            }
            else
                setDataMeta(ref, data, dec);
            for (const prop of dec.properties) {
                if (Array.isArray(data))
                    data.forEach(item => assignNullToEmptyProperty(item, prop));
                else
                    assignNullToEmptyProperty(data, prop);
            }
        }
    }
}
function assignNullToEmptyProperty(item, prop) {
    if (!item)
        return;
    if (item[prop.name] === undefined)
        item[prop.name] = null;
    if (prop.required) {
        setPropertyEmbeddedError(item, prop.name, null);
    } // to check later
}
exports.assignNullToEmptyProperty = assignNullToEmptyProperty;
function getDec(data) {
    return data._ ? data._.dec : null;
}
exports.getDec = getDec;
function validateData(data, ref) {
    let meta = data._;
    let requiredProps = meta.dec.properties.filter(p => p.required);
    for (const prop of requiredProps) {
        if (data[prop.name] == null) {
            notify(`Property '${prop.title}' is required.`, types_2.LogType.Warn);
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
function prepareServerUrl(ref, addPrefix = false) {
    ref = (ref || "").replace(/^\//, "");
    let locale = getQs('e');
    if (locale) {
        ref += '?e=' + locale;
    }
    if (addPrefix && exports.glob.config.prefix)
        ref = exports.glob.config.prefix + "/" + ref;
    return "/" + ref;
}
exports.prepareServerUrl = prepareServerUrl;
function loadObjectViewData(address, item, done) {
    address = processThisExpression(item, address);
    ajax(setQs('m', types_2.RequestMode.inline, false, address), null, null, res => {
        if (!res.data)
            return done(null);
        const setDataMeta = (ref, item, dec) => {
            item._ = item._ || {};
            item._.ref = ref;
            item._.dec = dec;
            return item._;
        };
        let ref = res.form.elems[0].obj._.ref;
        let dec = res.form.declarations[ref];
        let data = res.data[ref];
        if (dec)
            dec.newItemDefaults = getQs("d", address);
        if (!data || !dec)
            return done(null, { ref });
        exports.glob.data[ref] = res.data[ref];
        exports.glob.form.declarations[ref] = res.form.declarations[ref];
        data.forEach((item) => {
            let meta = setDataMeta(ref + "/" + item._id, item, dec);
            meta.marked = null;
        });
        for (const prop of dec.properties) {
            if (Array.isArray(data))
                data.forEach(item => assignNullToEmptyProperty(item, prop));
            else
                assignNullToEmptyProperty(data, prop);
        }
        exports.glob.data[ref] = data;
        done(null, { ref });
    }, err => notify(err));
}
exports.loadObjectViewData = loadObjectViewData;
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;
function handleResponse(res) {
    if (!res)
        throw "handleResponse: res is empty";
    if (res.config) {
        exports.glob.config = res.config;
        if (res.config.style)
            addHeadStyle(res.config.style);
        if (exports.glob.config.host && /^https?:/.test(exports.glob.config.host)) {
            let currentProtocol = location.protocol;
            exports.glob.config.host = exports.glob.config.host.replace(/^https?:/, currentProtocol);
        }
    }
    if (res.redirect)
        handleResponseRedirect(res);
    else if (res.message)
        notify(res.message, types_2.LogType.Info);
    else if (res.form) {
        // WARNING: never change these orders:
        vueResetFormData(res);
        exports.glob.data = res.data;
        exports.glob.form = res.form;
        store.commit('_commitReloadData', exports.glob.data);
        if (getQs(types_1.Constants.QUERY_NEW))
            initializeModifyForQueryNew(res);
        document.title = exports.glob.form.title;
        $('.details-view').scrollTop(0);
        $(window).scrollTop(0);
    }
    else {
        notify("WHAT should I do now?", types_2.LogType.Warn);
        console.log(res);
    }
    // must be set after binding to Vue
    exports.glob.texts = exports.glob.texts || res.texts || {};
}
exports.handleResponse = handleResponse;
function initializeModifyForQueryNew(res) {
    exports.glob.dirty = true;
    let parts = location.pathname.split('/');
    let ref = parts[parts.length - 1];
    let data = res.data[ref];
    let modifyData = { _id: types_1.ID.generateByBrowser(), _new: true };
    for (let prop in data) {
        if (data.hasOwnProperty(prop) && data[prop] != null)
            modifyData[prop] = data[prop];
    }
    exports.glob.modifies.push({
        ref,
        type: types_1.ChangeType.InsertItem,
        data: modifyData,
        state: data
    });
}
function digitGroup(num) {
    if (num == null)
        return "";
    let numParts = num.toString().split('.');
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return numParts.join('.');
}
exports.digitGroup = digitGroup;
function getPropTextValue(meta, data) {
    if (meta.formula)
        return evalExpression(data, meta.formula);
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
function equalID(id1, id2) {
    if (id1 == id2)
        return true;
    else if (!id1 || !id2)
        return false;
    else
        return id1.toString() == id2.toString();
}
exports.equalID = equalID;
function getPropReferenceValue(prop, data) {
    if (!data)
        return '';
    let val = data[prop.name];
    if (val == null)
        return '';
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
    }
    else {
        let item = prop._.items.find(i => equalID(i.ref, val));
        if (!item)
            return '...';
        return item.title;
    }
}
exports.getPropReferenceValue = getPropReferenceValue;
function showPropRefMenu(prop, instance, phrase, ctrl, removeCurrentValues, itemSelected) {
    let showDropDown = (items) => {
        let value = instance[prop.name];
        if (value != null && removeCurrentValues) {
            if (!Array.isArray(value))
                value = [value];
            let valueStrKeys = value.map(v => JSON.stringify(v));
            items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        }
        let highlightItem = null;
        if (phrase) {
            highlightItem = items.find(i => i.title.toLowerCase().indexOf(phrase.toLowerCase()) == 0);
            if (!highlightItem)
                highlightItem = items.find(i => i.title.toLowerCase().indexOf(phrase.toLowerCase()) > -1);
        }
        else if (value != null && !highlightItem)
            highlightItem = items.find(i => equalID(value, i.ref));
        if (!prop.required && items && items.length) {
            let emptyItem = { ref: null, title: "" };
            if (!highlightItem)
                highlightItem = emptyItem;
            items.unshift(emptyItem);
        }
        if (!items || !items.length) { // To reset the value
            let emptyItem = { ref: null, title: "" };
            if (!highlightItem)
                highlightItem = emptyItem;
            items.unshift(emptyItem);
        }
        if (highlightItem)
            highlightItem.hover = true;
        showCmenu(items, items, { ctrl }, (state, item) => {
            if (prop._.isRef) // Maybe we have some new items which we need client side
                for (let it of state) {
                    if (!prop._.items.find(i => i.ref == it.ref))
                        prop._.items.push(it);
                }
            itemSelected(item);
        });
    };
    if (prop._.isRef) {
        if (prop.referType == types_2.PropertyReferType.InnerSelectType) {
            let match = prop._.ref.match(/^(\w+\/\w+)/);
            instance = exports.glob.data[match[1]];
        }
        let query = prop.filter ? bson_util_1.parse(processThisExpression(instance, prop.filter), true, types_1.ID) : null;
        let data = { prop, instance, phrase, query };
        call('getPropertyReferenceValues', data, (err, res) => {
            if (err)
                notify(err, types_2.LogType.Error);
            else
                showDropDown(res.data);
        });
    }
    else {
        let items = phrase == null || (prop._.items.length < types_1.Constants.contextMenuVisibleItems && phrase == this.value) ? prop._.items : prop._.items.filter(item => item.title && item.title.toLowerCase().indexOf(phrase.toLowerCase()) > -1);
        items.forEach(item => item.hover = phrase == item.title);
        showDropDown(items);
    }
}
exports.showPropRefMenu = showPropRefMenu;
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
    return document.getElementsByTagName("html")[0].getAttribute("dir") == 'rtl';
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
function newID() {
    return types_1.ID.generateByBrowser();
}
exports.newID = newID;
function pushToGridViewRecentList(path, ref, title) {
    let recent = localStorage.getItem("gridView-recentItems-" + path);
    let recentItems = recent ? JSON.parse(recent) : [];
    let index = recentItems.findIndex(i => i.ref == ref);
    if (index > -1)
        recentItems.splice(index, 1);
    recentItems.unshift({ title, ref });
    if (recentItems.length > 5)
        recentItems.pop();
    localStorage.setItem("gridView-recentItems-" + path, JSON.stringify(recentItems));
}
exports.pushToGridViewRecentList = pushToGridViewRecentList;
function handleWindowEvents() {
    $(window)
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
        if (exports.glob.socket)
            exports.glob.socket.close();
    })
        .on("resize", (e) => {
        hideCmenu();
    })
        .on("keydown", (e) => {
        if (exports.glob.cmenu.show)
            handleCmenuKeys(e);
        if (exports.glob.question.show && e.which == types_2.Keys.esc) {
            exports.glob.question.show = false;
            exports.glob.question.select(null);
        }
        exports.glob.notify = null;
    })
        .on("mouseup", (e) => {
        if (exports.glob.cmenu.show &&
            !$('.dropdown-item').is(e.target)
            && $('.dropdown-item').has(e.target).length === 0
            && $('.dropdown-menu.show').has(e.target).length === 0)
            hideCmenu();
    });
    $(document).on("click", "a[href]", e => {
        let anchor = $(e.target).closest("a");
        if (anchor.attr("target"))
            return;
        let href = anchor.attr("href");
        if (!href || href.match(/^javascript/) || /^#/.test(href) || /^http/.test(href))
            return; // if (/^#/.test(href)) return false;
        e.preventDefault();
        if (!/\bf=\d/.test(href)) // push state on not function link / new item
            history.pushState(null, null, href);
        load(href);
    });
}
function handleImagesPreview(selector) {
    $(selector).on("mousedown", e => {
        exports.glob.imagePreview.url = e.target.src;
        exports.glob.imagePreview.show = true;
    });
}
exports.handleImagesPreview = handleImagesPreview;
function handleCmenuKeys(e) {
    switch (e.which) {
        case types_2.Keys.tab:
        case types_2.Keys.esc:
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
function getQs(key, href) {
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
    let url;
    if (href)
        url = [el.pathname, query].join("?");
    else
        url = fullPath ? [location.pathname, query].join("?") : query.toString();
    return url.replace(/\?$/, "");
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
function browseFile(fileBrowsed) {
    exports.glob.fileBrowsed = fileBrowsed;
    $('#file-browse').val('').click();
}
exports.browseFile = browseFile;
function refreshFileGallery(file) {
    openFileGallery(exports.glob.fileGallery.drive, file, exports.glob.fileGallery.path, exports.glob.fileGallery.fixedPath, exports.glob.fileGallery.fileSelectCallback);
}
exports.refreshFileGallery = refreshFileGallery;
function getNewItemTitle(title) {
    switch (exports.glob.config.locale) {
        case types_2.Locale[types_2.Locale.en]:
            return "New " + pluralize.singular(title);
        default:
            return $t("new-item");
    }
}
exports.getNewItemTitle = getNewItemTitle;
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
    ajax('/getFileGallery?m=1', { drive, path }, {}, res => {
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
        return size.toString();
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
    return parts[0].indexOf('/') == 0 ? uri : uri.substr(1);
}
exports.joinUri = joinUri;
function notify(content, type) {
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
    else {
        if (type == types_2.LogType.Debug) {
            exports.glob.inlineMessage = message;
            setTimeout(() => exports.glob.inlineMessage = null, types_1.Constants.inlineMessageDuration);
        }
        else if ($(".notify-message-container").length) {
            $(".notify-message-container").html(`<div class="notify-message-type-${type}">${message}</div>`);
        }
        else
            exports.glob.notify = { message, type };
    }
}
exports.notify = notify;
function question(title, message, buttons, options, select) {
    exports.glob.question = { title, message, buttons, options, select, show: true };
}
exports.question = question;
function loadHeadScript(src, done) {
    loadScript(src, document.head, done);
}
exports.loadHeadScript = loadHeadScript;
function loadBodyScript(src, done) {
    loadScript(src, document.body, done);
}
exports.loadBodyScript = loadBodyScript;
function loadScript(src, target, done) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.onload = function () {
        if (done)
            done();
    };
    target.appendChild(script);
}
function delScript(src) {
    const el = document.querySelector('script[src=\'' + src + '\']');
    if (el) {
        el.remove();
    }
}
exports.delScript = delScript;
function addHeadLink(href) {
    if (document.querySelector('link[href=\'' + href + '\']'))
        return;
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.head.appendChild(link);
}
exports.addHeadLink = addHeadLink;
function loadBodyLink(href) {
    if (document.querySelector('link[href=\'' + href + '\']')) {
        return;
    }
    const link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    document.body.appendChild(link);
}
exports.loadBodyLink = loadBodyLink;
function delLink(href) {
    const el = document.querySelector('link[href="' + href + '"]');
    if (el) {
        el.remove();
    }
}
exports.delLink = delLink;
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
function call(funcName, data, done) {
    data = data || {};
    data._ = data._ || {};
    data._.ref = location.href;
    let href = prepareServerUrl(funcName, true);
    href = setQs('m', types_2.RequestMode.inline, false, href);
    ajax(href, data, null, res => done(null, res), err => done(err));
}
exports.call = call;
function load(href, pushState = false) {
    if (exports.glob.dirty) {
        notify($t('save-before'), types_2.LogType.Warn);
        return;
    }
    if (pushState && location.href != href) {
        history.pushState(null, null, href);
    }
    exports.glob.notify = null;
    ajax(setQs('m', types_2.RequestMode.inline, false, href), null, { showProgress: true }, (res) => {
        // Hide menu on mobile mode after load object
        if (exports.glob.screen == types_1.ScreenSize.xs)
            exports.glob.showNavMenu = false;
        handleResponse(res);
        loadNotes(href);
    }, err => notify(err));
}
exports.load = load;
function loadNotes(url) {
    exports.glob.infoPanel.notes = [];
    ajax(prepareServerUrl("getNotes?m=1", true), { url }, null, (res) => {
        exports.glob.infoPanel.notes = res.data || [];
    });
}
exports.loadNotes = loadNotes;
function ajax(url, data, config, done, fail) {
    config = config || new types_2.AjaxConfig();
    if (config.showProgress)
        exports.glob.showProgress = true;
    fail = fail || notify;
    if (exports.glob.config.host)
        url = joinUri(exports.glob.config.host, url);
    // ajax params
    let params = {
        url,
        dataType: "text",
        transformResponse: res => res,
        method: config.method || (data ? types_2.WebMethod.post : types_2.WebMethod.get),
        headers: { 'Content-Type': "text/plain", 'Referrer-Policy': "unsafe-url" },
        withCredentials: true
    };
    // extract files raw data
    let multipart = false;
    if (data) {
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
            multipart = true;
            params.data = formData;
            params.data.append('data', bson_util_1.stringify(data, true));
            params.headers['Content-Type'] = 'multipart/form-data';
        }
    }
    // Cross origin support
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    // serialize data
    if (!multipart)
        params.data = bson_util_1.stringify(data, true);
    // if (params.data) console.log(params.data);
    //console.log("ajax params :", params);
    // Ajax call
    axios(params).then(res => {
        exports.glob.showProgress = false;
        if (res.status && res.status !== types_2.StatusCode.Ok) {
            fail({ code: res.status, message: res.statusText });
        }
        else {
            try {
                let result = bson_util_1.parse(res.data, true, types_1.ID);
                // console.log("ajax result :", result);
                done(result);
            }
            catch (ex) {
                console.error("Ajax parse", res, ex);
                notify(ex.message, types_2.LogType.Error);
            }
        }
    }).catch(err => {
        exports.glob.showProgress = false;
        console.error(`error on ajax '${url}'`, err);
        if (err.response && err.response.data) {
            try {
                let er = bson_util_1.parse(err.response.data, true, types_1.ID);
                fail(er);
            }
            catch (e) { // sometimes data is html which is wrong!
                fail(e);
            }
        }
        else
            fail({ message: err.toString(), code: types_2.StatusCode.UnknownError });
    });
}
exports.ajax = ajax;
function registerComponents(vue, components) {
    const requireComponent = require.context('./components', false, /\.vue$/);
    requireComponent.keys().forEach(fileName => {
        const componentConfig = requireComponent(fileName);
        const componentName = fileName.split('/').pop().replace(/\.\w+$/, '');
        vue_1.default.component(componentName, componentConfig.default || componentConfig);
    });
    if (components) {
        for (let name in components) {
            vue.component(name, components[name]);
        }
    }
    vue.component("SysApp", App_vue_1.default);
}
function checkScreenSize() {
    if (window.innerWidth < 768)
        exports.glob.screen = types_1.ScreenSize.xs;
    else if (window.innerWidth < 992)
        exports.glob.screen = types_1.ScreenSize.sm;
    else if (window.innerWidth < 1200)
        exports.glob.screen = types_1.ScreenSize.md;
    else
        exports.glob.screen = types_1.ScreenSize.lg;
}
function startVue(res, params) {
    try {
        handleWindowEvents();
        checkScreenSize();
        vue_1.default.use(vuex_1.default);
        store = new vuex_1.default.Store({
            state: { data: null },
            mutations: {
                _commitStoreChange,
                _commitServerChangeResponse,
                _commitReloadData,
                _commitReorderItems,
            },
            actions: {
                _dispatchStoreModify,
                _dispatchRequestServerModify,
            }
        });
        handleResponse(res);
        Object.assign(vue_1.default.config, { productionTip: false, devtools: true });
        vue_1.default.prototype.glob = exports.glob;
        vue_1.default.prototype.$t = $t;
        vue_1.default.prototype.rtl = exports.glob.config.rtl;
        vue_1.default.prototype.ltr = !exports.glob.config.rtl;
        vue_1.default.config.productionTip = false;
        vue_1.default.directive('focus', {
            inserted(el, binding) {
                if (binding.value)
                    el.focus();
            }
        });
        if (exports.glob.config.rtl)
            $("html").attr("dir", "rtl");
        registerComponents(vue_1.default, params ? params.components : null);
        socketConnect();
        new vue_1.default({ data: exports.glob, store, render: h => h((params ? params.app : null) || App_vue_1.default) }).$mount('#app');
    }
    catch (err) {
        console.error(err);
        notify("<strong>Starting Vue failed:</strong> " + err.message, types_2.LogType.Fatal);
    }
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
        case types_1.ChangeType.UploadFile:
        case types_1.ChangeType.SelectFile:
        case types_1.ChangeType.DeleteFile:
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
            if (!equalID(arg.modify.state._id, arg.res._id))
                notify(`data save error: state id '${arg.modify.state._id}' and request id '${arg.res._id}' are not same`, types_2.LogType.Error);
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
            break;
    }
}
function sort(array, prop = "_z") {
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
        modify = { ref: uri + "/" + item._id, type: types_1.ChangeType.EditProp, data: {}, state: item };
        exports.glob.modifies.push(modify);
    }
    modify.data._z = item._z;
}
function dispatchStoreModify(vue, change) {
    vue["$store"].dispatch('_dispatchStoreModify', change);
}
exports.dispatchStoreModify = dispatchStoreModify;
function _dispatchStoreModify(store, change) {
    let ref = change.uri;
    switch (change.type) {
        case types_1.ChangeType.EditProp: {
            let modify;
            modify = exports.glob.modifies.find(m => m.state == change.item && (m.type == types_1.ChangeType.InsertItem || m.type == types_1.ChangeType.EditProp));
            if (!modify) {
                modify = { ref, type: types_1.ChangeType.EditProp, data: {}, state: change.item };
                exports.glob.modifies.push(modify);
            }
            modify.data[change.prop.name] = change.value;
            break;
        }
        case types_1.ChangeType.InsertItem: {
            let data = { _id: change.item._id, _new: true };
            if (change.item._z)
                data["_z"] = change.item._z;
            exports.glob.modifies.push({ ref, type: types_1.ChangeType.InsertItem, data, state: change.item });
            break;
        }
        case types_1.ChangeType.DeleteItem: {
            ref = ref + "/" + change.item._id;
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
        case types_1.ChangeType.UploadFile:
        case types_1.ChangeType.SelectFile:
        case types_1.ChangeType.DeleteFile:
            let modify = {
                ref: change.item._.ref,
                type: change.type,
                data: {},
                state: change.item,
            };
            exports.glob.modifies.push(modify);
            modify.data[change.prop.name] = change.value || null;
            break;
    }
    exports.glob.dirty = exports.glob.modifies.length > 0;
    exports.glob.notify = null;
    commitStoreChange(store, change);
}
function dispatchRequestServerModify(store, done) {
    store.dispatch('_dispatchRequestServerModify', done);
}
exports.dispatchRequestServerModify = dispatchRequestServerModify;
function markDown(text, extraProcess = false) {
    if (!text)
        return "";
    if (extraProcess) {
        text = text.replace(/\*\*Note\*\*(\s+.+\s)/ig, "<div class='inline-note'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Note</strong>\r\n$1</div>");
        text = text.replace(/\*\*Tip\*\*(\s+.+\s)/ig, "<div class='inline-tip'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Tip</strong>\r\n$1</div>");
        text = text.replace(/\*\*Warning\*\*(\s+.+\s)/ig, "<div class='inline-warn'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Warning</strong>\r\n$1</div>");
    }
    return marked(text).replace(/^\<p\>|\<\/p\>\s*$/g, "");
}
exports.markDown = markDown;
function _dispatchRequestServerModify(store, done) {
    if (exports.glob.modifies.length == 0) {
        notify($t('nothing-todo'), types_2.LogType.Debug);
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
    // console.log(modify.data);
    // console.log(stringify(modify.data, true));
    ajax(prepareServerUrl(modify.ref, true), modify.data, { method }, (res) => {
        commitServerChangeResponse(store, modify, res.modifyResult);
        // New Item Page
        if (getQs("n")) {
            notify($t('saved'), types_2.LogType.Debug);
            exports.glob.dirty = false;
            clearModifies();
            let ref = prepareServerUrl(modify.ref + "/" + res.modifyResult._id, true);
            history.replaceState(null, null, ref);
            load(ref, false);
            done();
        }
        // Redirect
        else if (res.redirect && exports.glob.modifies.length == 0) {
            return handleResponseRedirect(res);
        }
        // Successful Modify
        else if (res.modifyResult) {
            if (exports.glob.modifies.length == 0) {
                notify($t('saved'), types_2.LogType.Debug);
                exports.glob.dirty = false;
                done();
            }
            else
                dispatchRequestServerModify(store, done);
        }
        // Error in saving
        else {
            exports.glob.modifies.unshift(modify);
            notify("A problem happened. Please refresh the page to check if your modifies have been saved or not!", types_2.LogType.Error);
            done("A problem happened. Please refresh the page to check if your modifies have been saved or not!");
        }
    }, (err) => {
        exports.glob.modifies.unshift(modify);
        notify(err, types_2.LogType.Error);
        done(err);
    });
}
function startServiceWorker() {
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/public/js/sw.js').then(registration => {
    //         // Registration was successful
    //         console.log('ServiceWorker registration successful with scope: ', registration.scope);
    //     }, function (err) {
    //         // registration failed :(
    //         console.warn('ServiceWorker registration failed: ', err);
    //     });
    // }
}
function start(params) {
    console.log('Starting ...');
    let mainState = $('#main-state').html();
    startServiceWorker();
    if (mainState) {
        // Used for SEO mode
        mainState = decodeURI(mainState);
        const res = bson_util_1.parse(mainState, true, types_1.ID);
        startVue(res, params);
    }
    else {
        let uri = setQs('m', types_2.RequestMode.inlineDev, false, (location.pathname && location.pathname != '/') ? location.pathname + location.search : types_1.Constants.defaultAddress);
        uri = setQs('t', Math.random(), false, uri);
        if (getQs(types_1.Constants.QUERY_LOCALE))
            uri = setQs(types_1.Constants.QUERY_LOCALE, getQs(types_1.Constants.QUERY_LOCALE), false, uri);
        // console.log(`loading main-state async from '${uri}' ...`);
        axios.get(uri, { transformResponse: res => res, withCredentials: true }).then(res => {
            if (res.data) {
                let data = bson_util_1.parse(res.data, true, types_1.ID);
                startVue(data, params);
            }
            else
                console.error(res);
        }).catch(err => {
            if (err.response && err.response.data && typeof err.response.data == "string") {
                let data = bson_util_1.parse(err.response.data, true, types_1.ID);
                if (data.redirect)
                    location.href = data.redirect;
                else
                    notify(data.message, types_2.LogType.Fatal);
            }
            else {
                notify("Connecting to proxy server failed! " + err.message, types_2.LogType.Fatal);
            }
        });
    }
    return exports.glob;
}
exports.start = start;
window["start"] = start;
exports.default = {};
//# sourceMappingURL=main.js.map