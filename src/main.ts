let index = {
    // Vuex
    "Modify                         ": dispatchStoreModify,
    "Server: Dispatch Changes       ": dispatchRequestServerModify,
    "Server: Commit Changes         ": commitServerChangeResponse,
    "Reorder Items                  ": commitReorderItems,

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

import {getBsonValue, parse, stringify} from 'bson-util';
import Vue from 'vue';
import Vuex from 'vuex';
import {Axios, ChangeType, Constants, Global, ID, JQuery, MenuItem, Modify, QuestionOptions, ScreenSize, Socket, StartParams, StateChange} from './types';
import {AjaxConfig, DirFile, FunctionDec, IData, IError, Keys, Locale, LogType, mFile, MultilangText, ObjectDec, Pair, Property, PropertyReferType, RequestMode, StatusCode, WebMethod, WebResponse} from '../../sys/src/types';
import App from './App.vue';
import pluralize = require('pluralize');

declare let $: JQuery, axios: Axios, io: Socket, marked: any;
export let glob: Global = window["__glob"] || new Global();
export {parse, stringify, getBsonValue};
window["__glob"] = glob;
let store;

export function getText(text: string | MultilangText, useDictionary?: boolean): string {
    if (!text) return "";

    if (typeof text == "string") {
        if (!useDictionary) return text;
        if (glob.texts[text]) return glob.texts[text];

        if (text.indexOf('.') == -1) {
            text = glob.texts["sys." + text] || text.replace(/-/g, " ");
            if (typeof text == "string") return text;
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

export function clone(obj: any) {
    return parse(stringify(obj, true), true, ID);
}

export function evalExpression($this: any, expression: string): any {
    try {
        if (expression == null) return null;
        return eval(expression.replace(/\bthis\b/g, '$this'));
    } catch (ex) {
        console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
    }
}

export function processThisExpression($this: any, expression: string): string {
    try {
        if (expression == null) return null;

        let match;
        let reg = /\bthis\.(\w+)/;
        while ((match = reg.exec(expression)) !== null) {
            let propName = match[1];
            let propReg = new RegExp(`\\bthis\\.${propName}`, "g");
            let val = getBsonValue($this[propName]);
            let valStr = JSON.stringify(val);
            expression = expression.replace(propReg, valStr);
        }
        return expression;
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
        res.form.elems.forEach(elem => elem.id = elem.id || ID.generateByBrowser()); // needs for refreshing form while cancel changes

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
                    let meta = setDataMeta(ref + "/" + item._id, item, dec);
                    meta.marked = null;
                });
            } else
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

export function assignNullToEmptyProperty(item, prop: Property) {
    if (!item) return;
    if (item[prop.name] === undefined) item[prop.name] = null;

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

export function prepareServerUrl(ref: string, addPrefix: boolean = false): string {
    ref = (ref || "").replace(/^\//, "");
    let locale = getQs('e');
    if (locale) {
        ref += '?e=' + locale;
    }
    if (addPrefix && glob.config.prefix)
        ref = glob.config.prefix + "/" + ref;
    return "/" + ref;
}

export function loadObjectViewData(address: string, item, done) {
    address = processThisExpression(item, address);
    ajax(setQs('m', RequestMode.inline, false, address), null, null, res => {
        if (!res.data) return done(null);

        const setDataMeta = (ref: string, item: IData, dec: ObjectDec | FunctionDec) => {
            item._ = item._ || {} as any;
            item._.ref = ref;
            item._.dec = dec;
            return item._;
        };

        let ref = res.form.elems[0].obj._.ref;
        let dec = res.form.declarations[ref];
        let data = res.data[ref];

        if (dec)
            (dec as ObjectDec).newItemDefaults = getQs("d", address);

        if (!data || !dec) return done(null, {ref});

        glob.data[ref] = res.data[ref];
        glob.form.declarations[ref] = res.form.declarations[ref];

        data.forEach((item: IData) => {
            let meta = setDataMeta(ref + "/" + item._id, item, dec);
            meta.marked = null;
        });

        for (const prop of dec.properties) {
            if (Array.isArray(data))
                data.forEach(item => assignNullToEmptyProperty(item, prop));
            else
                assignNullToEmptyProperty(data, prop);
        }

        glob.data[ref] = data;
        done(null, {ref});
    }, err => notify(err));
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
        glob.data = res.data;
        glob.form = res.form as any;
        store.commit('_commitReloadData', glob.data);

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
    let parts = location.pathname.split('/');
    let ref = parts[parts.length - 1];
    let data = res.data[ref];
    let modifyData = {_id: ID.generateByBrowser(), _new: true};
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
    if (id1 == id2) return true;
    else if (!id1 || !id2) return false;
    else return id1.toString() == id2.toString();
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

export function showPropRefMenu(prop: Property, instance: any, phrase: string, ctrl, removeCurrentValues: boolean, itemSelected: (item: MenuItem) => void) {
    let showDropDown = (items: MenuItem[]) => {

        let value = instance[prop.name];
        if (value != null && removeCurrentValues) {
            if (!Array.isArray(value)) value = [value];
            let valueStrKeys = value.map(v => JSON.stringify(v));
            items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        }

        let highlightItem: MenuItem = null;

        if (phrase) {
            highlightItem = items.find(i => i.title.toLowerCase().indexOf(phrase.toLowerCase()) == 0);
            if (!highlightItem)
                highlightItem = items.find(i => i.title.toLowerCase().indexOf(phrase.toLowerCase()) > -1);
        } else if (value != null && !highlightItem)
            highlightItem = items.find(i => equalID(value, i.ref));

        if (!prop.required && items && items.length) {
            let emptyItem = {ref: null, title: ""} as MenuItem;
            if (!highlightItem) highlightItem = emptyItem;
            items.unshift(emptyItem);
        }

        if (highlightItem) highlightItem.hover = true;

        showCmenu(items, items, {ctrl}, (state, item: MenuItem) => {
            if (prop._.isRef) // Maybe we have some new items which we need client side
                for (let it of state) {
                    if (!prop._.items.find(i => i.ref == it.ref))
                        prop._.items.push(it);
                }

            itemSelected(item);
        });
    };

    if (prop._.isRef) {
        if (prop.referType == PropertyReferType.InnerSelectType) {
            let match = prop._.ref.match(/^(\w+\/\w+)/);
            instance = glob.data[match[1]];
        }

        let query = prop.filter ? parse(processThisExpression(instance, prop.filter), true, ID) : null;
        let data = {prop, instance, phrase, query};

        call('getPropertyReferenceValues', data, (err, res) => {
            if (err)
                notify(err, LogType.Error);
            else
                showDropDown(res.data);
        });
    } else {
        let items = phrase == null || (prop._.items.length < Constants.contextMenuVisibleItems && phrase == this.value) ? prop._.items : prop._.items.filter(item => item.title && item.title.toLowerCase().indexOf(phrase.toLowerCase()) > -1);
        items.forEach(item => (item as MenuItem).hover = phrase == item.title);
        showDropDown(items);
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
    return document.getElementsByTagName("html")[0].getAttribute("dir") == 'rtl';
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

export function newID() {
    return ID.generateByBrowser();
}

export function pushToGridViewRecentList(path: string, ref: string, title: string) {
    let recent = localStorage.getItem("gridView-recentItems-" + path);
    let recentItems = recent ? JSON.parse(recent) : [];
    let index = recentItems.findIndex(i => i.ref == ref);
    if (index > -1)
        recentItems.splice(index, 1);
    recentItems.unshift({title, ref});
    if (recentItems.length > 5)
        recentItems.pop();
    localStorage.setItem("gridView-recentItems-" + path, JSON.stringify(recentItems));
}

function handleWindowEvents() {
    $(window)
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
            if (glob.socket)
                glob.socket.close();
        })
        .on("resize", (e) => {
            hideCmenu();
        })
        .on("keydown", (e) => {
            if (glob.cmenu.show)
                handleCmenuKeys(e);

            if (glob.question.show && e.which == Keys.esc) {
                glob.question.show = false;
                glob.question.select(null);
            }

            glob.notify = null;
        })
        .on("mouseup", (e: any) => {
            if (glob.cmenu.show &&
                !$('.dropdown-item').is(e.target)
                && $('.dropdown-item').has(e.target).length === 0
                && $('.dropdown-menu.show').has(e.target).length === 0
            ) hideCmenu();
        });

    $(document).on("click", "a[href]", e => {
        let anchor = $(e.target).closest("a");
        if (anchor.attr("target")) return;

        let href = anchor.attr("href");
        if (!href || href.match(/^javascript/) || /^#/.test(href) || /^http/.test(href)) return; // if (/^#/.test(href)) return false;

        e.preventDefault();
        if (!/\bf=\d/.test(href)) // push state on not function link / new item
            history.pushState(null, null, href);
        load(href);
    });
}

export function handleImagesPreview(selector: string) {
    $(selector).on("mousedown", e => {
        glob.imagePreview.url = e.target.src;
        glob.imagePreview.show = true;
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

export function getQs(key: string, href?: string): string {
    let search, el;
    if (href) {
        el = document.createElement('a');
        el.href = href;
        search = el.search;
    } else {
        search = location.search;
    }
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

export function browseFile(fileBrowsed?: (files: mFile[]) => void) {
    glob.fileBrowsed = fileBrowsed;
    $('#file-browse').val('').click();
}

export function refreshFileGallery(file?: string) {
    openFileGallery(glob.fileGallery.drive, file, glob.fileGallery.path, glob.fileGallery.fixedPath, glob.fileGallery.fileSelectCallback);
}

export function getNewItemTitle(title: string) {
    switch (glob.config.locale) {
        case Locale[Locale.en]:
            return "New " + pluralize.singular(title);

        default:
            return $t("new-item");
    }
}

export function openFileGallery(drive: ID, file: string, path: string, fixedPath: boolean,
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

    ajax('/getFileGallery?m=1', {drive, path}, {}, res => {
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
        return size.toString();
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

export function notify(content: string | IError, type?: LogType) {
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
    else {
        if (type == LogType.Debug) {
            $(".inline-message-box span").text(message);
            $(".inline-message-box").show();
            setTimeout(function () {
                $(".inline-message-box").hide();
            }, 5000);
        } else if ($(".notify-message-container").length) {
            $(".notify-message-container").html(`<div class="notify-message-type-${type}">${message}</div>`);
        } else
            glob.notify = {message, type};
    }
}

export function question(title: string, message: string, buttons: Pair[], options: QuestionOptions, select: (ref: any) => void) {
    glob.question = {title, message, buttons, options, select, show: true};
}

export function loadHeadScript(src, done) {
    loadScript(src, document.head, done);
}

export function loadBodyScript(src, done?) {
    loadScript(src, document.body, done);
}

function loadScript(src, target, done) {
    if (document.querySelector('script[src=\'' + src + '\']')) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute('type', 'text/javascript');
    script.onload = function () {
        if (done) done();
    };
    target.appendChild(script);
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

export function call(funcName: string, data: any, done: (err, res?) => void) {
    data = data || {};
    data._ = data._ || {};
    data._.ref = location.href;
    let href = prepareServerUrl(funcName, true);
    href = setQs('m', RequestMode.inline, false, href);
    ajax(href, data, null, res => done(null, res), err => done(err));
}

export function load(href: string, pushState = false) {
    if (glob.dirty) {
        notify($t('save-before'), LogType.Warning);
        return;
    }

    if (pushState && location.href != href) {
        history.pushState(null, null, href);
    }

    glob.notify = null;
    ajax(setQs('m', RequestMode.inline, false, href), null, {showProgress: true}, (res) => {

        // Hide menu on mobile mode after load object
        if (glob.screen == ScreenSize.xs) glob.showNavMenu = false;
        handleResponse(res);
        loadNotes(href);
    }, err => notify(err));
}

export function loadNotes(url) {
    glob.infoPanel.notes = [];
    ajax(prepareServerUrl("getNotes?m=1", true), {url}, null, (res) => {
        glob.infoPanel.notes = res.data || [];
    });
}

export function ajax(url: string, data, config: AjaxConfig, done: (res: WebResponse) => void, fail?: (err: { code: StatusCode, message: string }) => void) {
    config = config || new AjaxConfig();
    if (config.showProgress)
        glob.showProgress = true;
    fail = fail || notify;
    if (glob.config.host) url = joinUri(glob.config.host, url);

    // ajax params
    let params: any = {
        url,
        dataType: "text",
        transformResponse: res => res,
        method: config.method || (data ? WebMethod.post : WebMethod.get),
        headers: {'Content-Type': "text/plain"},
        withCredentials: true
    };

    // extract files raw data
    let multipart = false;
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
            multipart = true;
            params.data = formData;
            params.data.append('data', stringify(data, true));
            params.headers['Content-Type'] = 'multipart/form-data';
        }
    }

    // Cross origin support
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

    // serialize data
    if (!multipart)
        params.data = stringify(data, true);
    // if (params.data) console.log(params.data);
    //console.log("ajax params :", params);

    // Ajax call
    axios(params).then(res => {
        glob.showProgress = false;
        if (res.status && res.status !== StatusCode.Ok) {
            fail({code: res.status, message: res.statusText});
        } else {
            try {
                let result = parse(res.data, true, ID);
                // console.log("ajax result :", result);
                done(result);
            } catch (ex) {
                console.error("Ajax parse", res, ex);
                notify(ex.message, LogType.Error);
            }
        }
    }).catch(err => {
        glob.showProgress = false;
        console.error(`error on ajax '${url}'`, err);
        if (err.response && err.response.data) {
            try {
                let er = parse(err.response.data, true, ID);
                fail(er);
            } catch (e) { // sometimes data is html which is wrong!
                fail(e);
            }
        } else
            fail({message: err.toString(), code: StatusCode.UnknownError});
    });
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

function checkScreenSize() {
    if (window.innerWidth < 768) glob.screen = ScreenSize.xs;
    else if (window.innerWidth < 992) glob.screen = ScreenSize.sm;
    else if (window.innerWidth < 1200) glob.screen = ScreenSize.md;
    else glob.screen = ScreenSize.lg;
}

function startVue(res: WebResponse, params?: StartParams) {
    try {
        handleWindowEvents();
        checkScreenSize();

        Vue.use(Vuex);
        store = new Vuex.Store({
            state: {data: null},
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
        console.log('glob.socket initing ...');
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
        case ChangeType.UploadFile:
        case ChangeType.SelectFile:
        case ChangeType.DeleteFile:
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
            if (!equalID(arg.modify.state._id, arg.res._id))
                notify(`data save error: state id '${arg.modify.state._id}' and request id '${arg.res._id}' are not same`, LogType.Error);
            for (let key in arg.res) {
                arg.modify.state[key] = arg.res[key];
            }
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
        modify = {ref: uri + "/" + item._id, type: ChangeType.EditProp, data: {} as IData, state: item};
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
            let data = {_id: change.item._id, _new: true};
            if (change.item._z) data["_z"] = change.item._z;
            glob.modifies.push({ref, type: ChangeType.InsertItem, data, state: change.item});
            break;
        }

        case ChangeType.DeleteItem: {
            ref = ref + "/" + change.item._id;
            let modify = glob.modifies.find(m => m.state == change.item);
            if (modify) {
                glob.modifies.splice(glob.modifies.indexOf(modify), 1);
                if (modify.type != ChangeType.InsertItem) // delete before saving in server
                    glob.modifies.push({state: change.item, ref, type: ChangeType.DeleteItem});
            } else
                glob.modifies.push({state: change.item, ref, type: ChangeType.DeleteItem});
            break;
        }

        case ChangeType.UploadFile:
        case ChangeType.SelectFile:
        case ChangeType.DeleteFile:
            let modify = {
                ref: change.item._.ref,
                type: change.type,
                data: {},
                state: change.item,
            } as Modify;
            glob.modifies.push(modify);
            modify.data[change.prop.name] = change.value || null;
            break;
    }

    glob.dirty = glob.modifies.length > 0;
    glob.notify = null;
    commitStoreChange(store, change);
}

export function dispatchRequestServerModify(store, done: (err?) => void) {
    store.dispatch('_dispatchRequestServerModify', done);
}

export function markDown(text: string, extraProcess: boolean = false): string {
    if (!text) return "";
    if (extraProcess) {
        text = text.replace(/\*\*Note\*\*(\s+.+\s)/ig, "<div class='inline-note'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Note</strong>\r\n$1</div>");
        text = text.replace(/\*\*Tip\*\*(\s+.+\s)/ig, "<div class='inline-tip'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Tip</strong>\r\n$1</div>");
        text = text.replace(/\*\*Warning\*\*(\s+.+\s)/ig, "<div class='inline-warn'><i class='fal text-primary mr-2 fa-info-circle'></i><strong>Warning</strong>\r\n$1</div>");
    }
    return marked(text).replace(/^\<p\>|\<\/p\>\s*$/g, "");
}

function _dispatchRequestServerModify(store, done: (err?) => void) {
    if (glob.modifies.length == 0) {
        notify($t('nothing-todo'), LogType.Debug);
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
    // console.log(modify.data);
    // console.log(stringify(modify.data, true));

    ajax(prepareServerUrl(modify.ref, true), modify.data, {method}, (res) => {
        commitServerChangeResponse(store, modify, res.modifyResult);

        // New Item Page
        if (getQs("n")) {
            notify($t('saved'), LogType.Debug);
            glob.dirty = false;
            clearModifies();
            let ref = prepareServerUrl(modify.ref + "/" + res.modifyResult._id, true);
            history.replaceState(null, null, ref);
            load(ref, false);
            done();
        }
        // Redirect
        else if (res.redirect && glob.modifies.length == 0) {
            return handleResponseRedirect(res);
        }
        // Successful Modify
        else if (res.modifyResult) {
            if (glob.modifies.length == 0) {
                notify($t('saved'), LogType.Debug);
                glob.dirty = false;
                done();
            } else
                dispatchRequestServerModify(store, done);
        }
        // Error in saving
        else {
            glob.modifies.unshift(modify);
            notify("A problem happened. Please refresh the page to check if your modifies have been saved or not!", LogType.Error);
            done("A problem happened. Please refresh the page to check if your modifies have been saved or not!");
        }
    }, (err) => {
        glob.modifies.unshift(modify);
        notify(err, LogType.Error);
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

export function start(params?: StartParams) {
    console.log('Starting ...');
    const mainState = $('#main-state').html();
    // console.log('mainState', mainState);
    const res: WebResponse = parse(mainState, true, ID);
    startServiceWorker();

    if (res)
        startVue(res, params);
    else {
        let uri = setQs('m', RequestMode.inlineDev, false, (location.pathname && location.pathname != '/') ? location.pathname + location.search : Constants.defaultAddress);
        uri = setQs('t', Math.random(), false, uri);
        if (getQs(Constants.QUERY_LOCALE))
            uri = setQs(Constants.QUERY_LOCALE, getQs(Constants.QUERY_LOCALE), false, uri);
        // console.log(`loading main-state async from '${uri}' ...`);
        axios.get(uri, {transformResponse: res => res, withCredentials: true}).then(res => {
            if (res.data) {
                let data = parse(res.data, true, ID);
                startVue(data, params);
            } else
                console.error(res);
        }).catch(err => {
            if (err.response && err.response.data && typeof err.response.data == "string") {
                let data = parse(err.response.data, true, ID);
                if (data.redirect)
                    location.href = data.redirect;
                else
                    notify(data.message, LogType.Fatal);
            } else {
                notify("Connecting to proxy server failed! " + err.message, LogType.Fatal);
            }
        });
    }
    return glob;
}

window["start"] = start;
export default {};
