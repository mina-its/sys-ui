declare let WeakSet, moment, $, io: any;
import Vue from 'vue';
import App from './App.vue';
import {Constants, MenuItem, State, StateCmenu, StateGeoMap} from "@/types";
import _ = require('lodash/core');
import sys = require("../../sys/client/main");
import {Global, MenuItem, State, StateCmenu, StateGeoMap, Constants} from "@/types";
import {
	DirFile,
	DirFileType,
	Drive,
	Form,
	Keys,
	LogType,
	Property,
	RequestMode,
	WebResponse
} from "../../sys/src/types";
import {NotificationInfo} from "../../sys/client/types";
import {AjaxConfig, ComponentParams, ItemMeta, ItemState, NotificationInfo} from "./types";
import {EmbeddedInfo, GetOptions, IError, LogType, Pair, StatusCode, WebMethod, WebResponse} from "../src/types";

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount('#app');

export function $t(key: string): string {
	return sys.getText('sys', key);
}

function validateTemplate(): boolean {
	if (!$("#root").length) {
		console.error("Html element like <div id=\"root\"> is expected!");
		return false;
	}

	return true;
}

export function start() {
	if (!validateTemplate()) return;
	startVue();
	handleWindowEvents();
	console.log(
		`%c sys.main started. %c version: 5.2.4 %c`,
		'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
		'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
		'background:transparent'
	);
}

function startVue() {
	Vue.config.devtools = true;

	st = {
		form: {} as Form,
		menu: [],
		navmenu: [],
		data: {},
		fileGallery: {
			drive: null,
			path: "",
			list: [],
			file: null,
			selectable: null,
		},
		question: {
			message: null,
			options: []
		},
		modal: false,
		toolbar: false,
		config: {
			appTitle: "",
			brandingLogo: "",
			locale: "",
			appLocales: [],
			loginRef: "",
			loginTitle: ""
		},
		dirty: false,
		notify: null,
		cmenu: {show: false, items: [], handler: null, left: 0, top: 0} as StateCmenu,
		geoMap: {show: false} as StateGeoMap
	} as State;

	Vue.st = Vue.prototype.st = st;

	let mainState = $("#main-state").html();
	let res: WebResponse = mainState ? parse(mainState) : {};
	st.config = res.config || {} as any;
	st.logs = [];
	st.menu = res.menu;
	getNavmenu(res);

	if (res.message) {
		sys.notify(res);
	} else
		initState(res);

	Vue.directive("focus", {
		inserted: function (el, binding) {
			if (binding.value)
				el.focus();
		}
		// , update: function (el, binding) {
		// 	if (binding.value) {
		// 		Vue.nextTick(function () {
		// 			el.focus();
		// 		});
		// 	}
		// }
	});

	new Vue({
		el: "#root", data: st, mounted: () => {
			if (glob.onReady) glob.onReady();
		}
	});
}

export function getNavmenu(res: WebResponse) {
	let _navmenu = localStorage.getItem('_navmenu');
	// if (_navmenu)
	// 	st.navmenu = JSON.parse(_navmenu);
	// else
	st.navmenu = res.navmenu;
}

export function setNavmenu() {
	let ref = location.pathname;
	let title = document.title;
	// if (st.form.breadcrumb && st.form.breadcrumb.length > 0) {
	// 	let rootref = st.form.breadcrumb[0].ref;
	// 	let rootItem = st.navmenu.filter(item => item.ref == rootref).pop();
	// 	if (!rootItem)
	// 		rootItem = {ref: rootref, title: st.form.breadcrumb[0].title};
	//
	// 	st.navmenu = st.navmenu.filter(item => item.ref != rootItem).slice(0, 3);
	// 	st.navmenu.unshift(rootItem);
	// } else {
	//st.navmenu = st.navmenu.filter(item => item.ref != ref).slice(0, 8);
	//st.navmenu.unshift({title, ref});
	//}
	localStorage.setItem('_navmenu', JSON.stringify(st.navmenu));
}

export function evalExpression($this: any, expression: string): any {
	try {
		if (expression == null) return null;
		return eval(expression.replace(/\bthis\b/g, '$this'));
	} catch (ex) {
		console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
	}
}

function handleWindowEvents() {
	$(window)
		.on('notify', function (e: any) {
			let notify: NotificationInfo = e.detail;

			switch (notify.type) {
				case LogType.Debug:
					$("#snackbar").addClass("visible").text(notify.message);
					setTimeout(function () {
						$("#snackbar").removeClass("visible");
					}, 3000);
					break;

				default:
					st.notify = notify;
					break;
			}
		})
		.on('question', function (e: any) {
			st.question = e.detail;
		})
		.on("popstate", (e) => {
			load(location.href);
		})
		.on("beforeunload", (e) => {
			if (st.dirty) {
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
			if (st.cmenu.show)
				handleCmenuKeys(e);
			st.notify = null;
		})
		.on("click", (e) => {
			if (e.target.tagName == "A") {
				if (e.target.getAttribute('target')) return; // especially _blank
				let href = e.target.getAttribute('href');
				if (href) {
					if (href.match(/^javascript/) || /^#/.test(href)) return; // if (/^#/.test(href)) return false;
					e.preventDefault();
					if (st.dirty) {
						sys.notify($t('save-before'), LogType.Warning);
						return;
					} // dirty page
					if (/\bf=\d/.test(href)) { // function link

					} else
						history.pushState(null, null, href);
					load(href);
				}
			}
		})
		.on("mouseup", (e) => {
			if (st.cmenu.show &&
				!$('.dropdown-item').is(e.target)
				&& $('.dropdown-item').has(e.target).length === 0
				&& $('.dropdown-menu.show').has(e.target).length === 0
			) hideCmenu();
		});
}

export function initState(res: WebResponse) {
	//log("load res: ", res.data);
	let title = "";
	if (res.form) {
		st.form = res.form;
		title = st.form.title as string;
	}
	document.title = title;
	st.headFuncs = [];
	st.toolbar = false;
	st.meta = res.meta || {};
	if (res.config) st.config = res.config as any;
	let data = res.data || {};
	for (let prop in data) {
		vueResetProperties(data[prop], prop, true);
	}

	glob.od = JSON.parse(JSON.stringify(data));
	st.data = data;
	$(".details-view").scrollTop(0);
	setNavmenu();
}

function setUndefinedToNull(item, prop: Property) {
	if (!item) return;
	if (item[prop.name] === undefined)
		item[prop.name] = null;

	if (prop.required)
		sys.setPropertyEmbeddedError(item, prop.name, null); // to check later
}

export function vueResetProperties(data: any, name: string, resetStatus: boolean) {
	let meta = st.meta[name];
	if (Array.isArray(data)) {
		if (resetStatus)
			data.forEach((item) => {
				item._status = null;
			});
	} else {
		if (data._id < 0) // new item
			st.dirty = true;
	}

	if (!meta || !meta.properties) return;
	for (let prop of meta.properties) {
		if (Array.isArray(data)) {
			data.forEach((item) => {
				setUndefinedToNull(item, prop);
			});
		} else {
			setUndefinedToNull(data, prop);
		}
	}
}

function validateData(data, ref: string): boolean {
	let meta = st.meta[ref];
	let requiredProps = _.filter(meta.properties, {required: true});
	for (let prop of requiredProps) {
		if (_.isNull(data[prop.name])) {
			sys.notify(`Property '${prop.name}' is required.`, LogType.Warning);
			// if (!Array.isArray(st.data[ref]))
			// 	data._error = `Property '${prop.name}' is required.`;
			return false;
		}
	}
	return true;
}

export function validate(): boolean {
	for (let ref in st.data) {
		if (Array.isArray(st.data[ref])) {
			for (let item of st.data[ref]) {
				if (!validateData(item, ref))
					return false;
			}
		} else if (!validateData(st.data[ref], ref))
			return false;
	}

	return true;
}

export function someProps(prop): boolean {
	return Array.isArray(prop.properties) && prop.properties.length;
}

export function commitNewItem() {
	let objectName = location.pathname.replace(/\//, '');
	let data = st.data[objectName];
	if (data._id != -1) {
		sys.notify('Invalid state, please refresh and check if the item already has been added!', LogType.Error);
		return;
	}
	for (let ref in st.data) {
		if (ref.indexOf(objectName + "/") == 0) {
			data[ref.substr(objectName.length + 1)] = st.data[ref];
		}
	}

	sys.ajax(prepareServerUrl(objectName), data, null, (res) => {
		st.dirty = false;
		location.href = `/${objectName}/${res.data._id.$oid}`;
	}, (err) => {
		sys.notify(err);
	});
}

export function prepareServerUrl(ref: string): string {
	ref = '/' + ref;
	let locale = getQs("e");
	if (locale)
		ref += "?e=" + locale;
	return ref;
}

export function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function resetToolbar() {
	st.toolbar = false;
}

export function load(href) {
	if (st.dirty) {
		sys.notify($t('save-before'), LogType.Warning);
		return;
	}

	sys.ajax(setQs('m', RequestMode.partial, false, href), null, null, handleResponse, (err) => {
		sys.notify(err);
	});
}

export function handleResponse(res: WebResponse) {
	res = flat2recursive(res);
	if (res.redirect)
		handleResponseRedirect(res);
	else if (res.message) {
		sys.notify(res.message, LogType.Info);
		// resetToolbar();
		// history.pushState(null, null, "/");
	} else
		initState(res);
}

export function setPropTextValue(meta, data, val): void {
	let locale = getQs('e') || "en";
	let oldValue = data[meta.name];

	if (meta.text && meta.text.multiLanguage) {
		if (locale) {
			if (typeof oldValue == "string")
				data[meta.name] = {"en": oldValue};
			else
				data[meta.name] = data[meta.name] || {};

			data[meta.name][locale] = val;
		} else {
			if (_.isObject(oldValue))
				data[meta.name]["en"] = val;
			else
				data[meta.name] = val;
		}
	} else
		data[meta.name] = val;
}

export function getPropTextValue(meta: Property, data): any {
	if (meta.formula)
		return evalExpression(this.doc, meta.formula);

	if (!data) throw "prop-text doc is null!";
	let val = data[meta.name];
	if (_.isObject(val)) {
		let locale = getQs('e') || "en";
		return val[locale];
	} else
		return val;
}

export function getPropReferenceValue(meta: Property, data): string {
	if (!data) return "";
	let val = data[meta.name];
	if (!val) return "";

	if (meta.isList) {
		if (!Array.isArray(val))
			val = [val];

		let values = [];
		for (let valItem of val) {
			let item = _.find(meta._.items, {ref: valItem});
			if (!item)
				values.push("...");
			else
				values.push(item.title);
		}
		return values.join(", ");
	} else {
		let item = _.find(meta._.items, {ref: val});
		if (!item) return "...";
		return item.title;
	}
}

function refresh() {
	st.dirty = false;
	location.reload();
}

export function handleResponseRedirect(res: WebResponse) {
	if (res.redirect == Constants.redirectBack) {
		window.history.back();
	} else if (res.redirect == Constants.redirectSelf) {
		refresh();
	} else if (!$.isEmptyObject(res.data)) {
		let form = '';
		$.each(res.data, function (key, value) {
			form += '<input type="hidden" name="' + key + '" value="' + value + '">';
		});
		$('<form action="' + res.redirect + '" method="POST">' + form + '</form>').appendTo('body').submit();
	} else {
		window.open(res.redirect, '_self'); // res.newWindow ? '_blank' : '_self'
	}
}

export function isRtl() {
	return $("body").attr("dir") == "rtl";
}

export function showCmenu(state, items: MenuItem[], event, handler: (state, item: MenuItem) => void) {
	if (!items || items.length == 0) {
		hideCmenu();
		return;
	}
	for (let item of items) {
		item.hover = item.hover || false;
	}
	if (!_.some(items, {hover: true})) {
		if (!items[0].title) {
			items[0].hover = false;
			items[1].hover = true;
		} else
			items[0].hover = true;
	}

	st.cmenu = {show: true, items, handler, state, top: 0, left: 0, right: 0, bottom: 0, event};
}

export function hideCmenu() {
	st.cmenu.show = false;
}

function handleCmenuKeys(e) {
	switch (e.which) {
		case Keys.tab:
		case Keys.esc:
			st.cmenu.handler(st.cmenu.state, null);
			hideCmenu();
			break;

		case Keys.enter: {
			let item = _.find(st.cmenu.items, {hover: true});
			if (item) {
				st.cmenu.handler(st.cmenu.state, item);
				hideCmenu();
			}
			break;
		}

		case Keys.down: {
			let item = _.find(st.cmenu.items, {hover: true});
			if (!item)
				st.cmenu.items[0].hover = true;
			else {
				let i = st.cmenu.items.indexOf(item);
				if (i < st.cmenu.items.length - 1) {
					item.hover = false;
					st.cmenu.items[i + 1].hover = true;
				}
			}
			break;
		}

		case Keys.up: {
			let item = _.find(st.cmenu.items, {hover: true});
			if (!item)
				st.cmenu.items[st.cmenu.items.length - 1].hover = true;
			else {
				let i = st.cmenu.items.indexOf(item);
				if (i > 0) {
					item.hover = false;
					st.cmenu.items[i - 1].hover = true;
				}
			}
			break;
		}
	}
}

export function changeLocale(locale) {
	location.href = setQs('e', locale, true);
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
	} else
		search = location.search;
	let query = new URLSearchParams(search);
	if (value == null)
		query.delete(key);
	else
		query.set(key, value.toString());

	if (href)
		return el.pathname + "?" + query;
	else
		return fullPath ? (location.pathname + "?" + query) : query.toString();
}

export function checkPropDependencyOnChange(meta, prop, instance: any) {
	let dependents = meta.properties.filter((p) => {
		return p.dependsOn == prop.name
	});
	for (let prop of dependents) {
		instance[prop.name] = null;
		if (prop._items) {
			prop._items = null;
			let data = {prop, instance};
			sys.ajax("/getPropertyReferenceValues", data, null, (res) => {
				prop._items = res.data;
			}, (err) => {
				sys.notify(err);
			});
		}
	}
}

function parse(str: string): any {
	let flatJson = JSON.parse(str);
	return flat2recursive(flatJson);
}

export function flat2recursive(flatJson: any): any {
	let keys = {};
	const findKeys = (obj) => {
		if (obj && obj._0) {
			keys[obj._0] = obj;
			delete obj._0;
		}

		for (let key in obj) {
			if (typeof obj[key] === "object")
				findKeys(obj[key]);
		}
	};

	const seen = new WeakSet();
	const replaceRef = (obj) => {
		if (seen.has(obj)) return;
		seen.add(obj);

		for (let key in obj) {
			let val = obj[key];
			if (!val) continue;
			if (typeof val === "object" && !val.$oid) {
				if (val._$ == "") {
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

export function browseFile(fileBrowsed?: (files: any[]) => void) {
	st.fileGallery.fileBrowsed = fileBrowsed;
	$("#file-browse").val("").click();
}

export function refreshFileGallery(file?: string, done?) {
	openFileGallery(st.fileGallery.drive, file, st.fileGallery.path, st.fileGallery.fixedPath, st.fileGallery.fileSelectCallback, done);
}

export function getText(text) {
	return typeof (text) == "object" ? text[st.config.locale] || _.values(text)[0] : text;
}

export function prop(component): Property {
	return component.meta as Property;
}

export function openFileGallery(drive: Drive, file: string, path: string, fixedPath: boolean, fileSelectCallback: (path: string, item: DirFile) => void, done?) {
	st.fileGallery.drive = drive;
	st.fileGallery.file = file;
	st.fileGallery.path = path || "";
	st.fileGallery.fixedPath = fixedPath;
	st.fileGallery.selectable = true;
	st.fileGallery.fileSelectCallback = fileSelectCallback;

	$("#file-gallery").modal("show");
	st.fileGallery.loading = true;
	st.fileGallery.list = [];
	sys.ajax('/getFileGallery?m=1', {drive: drive._id, path}, {}, (res) => {
		st.fileGallery.loading = false;
		st.fileGallery.uri = res.data.uri;
		st.fileGallery.list = res.data.list;
		st.fileGallery.selected = st.fileGallery.list.find(l => l.name == st.fileGallery.file);
		if (done) done();
	});
}

export function component(name: string, props: string[], params: ComponentParams) {
	(params as any).props = props;
	Vue.component(name, params);
}

export function get(pack: string, objectName: string, options: GetOptions, done: (err, result?) => void) {
}

export function log(...message) {
	console.log(message);
}

export function isRtl() {
	return false;
}

export function invoke(pack: string, name: string, args: any[]) {
	return false;
}

export function getText(pack, key) {
	if (text[pack + "." + key]) return text[pack + "." + key];

	console.warn(`Warning: text '${pack}.${key}' not found`);
	return key.replace(/-/g, " ");
}

export function toFriendlyFileSizeString(size: number): string {
	if (size < 1024)
		return size + " B";

	else if (size < 1024 * 1024)
		return (size / 1024).toFixed(1) + " KB";

	else
		return (size / 1024 / 1024).toFixed(1) + " MB";
}

export function joinUri(...parts: string[]): string {
	let uri = "";
	for (let part of parts) {
		uri += "/" + (part || "").replace(/^\//, '').replace(/\/$/, '');
	}
	return uri.substr(1);
}

export function ajax(url: string, data: any, config: AjaxConfig, done: (res: WebResponse) => void, fail?: (err: { code: StatusCode, message: string }) => void) {
	let params: any = {url, data};

	if (config && config.method)
		params.method = config.method;
	else
		params.method = data ? WebMethod.post : WebMethod.get;

	if (data && data._files) {
		params.data = new FormData();
		for (let file of data._files) {
			params.data.append('files[]', file, file['name']);
		}
		params.data.append('data', JSON.stringify(data));
		params.headers = {'Content-Type': 'multipart/form-data'};
	}

	fail = fail || notify;
	axios(params).then((res) => {
		if (res.code && res.code != StatusCode.Ok)
			fail({code: res.code, message: res.message});
		else {
			try {
				done(res.data);
			} catch (ex) {
				notify(`error on handling ajax response: ${ex.message}`);
				console.error(res, ex);
			}
		}
	}).catch((err) => {
		console.error(`error on ajax '${url}'`, err);

		if (err.response && err.response.data && err.response.data.message)
			fail({message: err.response.data.message, code: err.response.data.code});
		else if (err.response && err.response.data)
			fail({message: err.response.data, code: err.response.status});
		else
			fail({message: err.toString(), code: StatusCode.UnknownError});
	});
}

export function notify(content: string | IError, type?: LogType, params?: NotificationInfo) {
	if (!content) return;
	let message = typeof content == "string" ? content : content.message;
	if (!type) {
		if (typeof content != "string")
			type = content.code && content.code != StatusCode.Ok ? LogType.Error : LogType.Info;
		else
			type = LogType.Info;
	}
	window.dispatchEvent(new CustomEvent('notify', {detail: {message, type}}));
}

export function question(questionId: string, message: string, options: Pair[], select: (item: Pair) => void) {
	window.dispatchEvent(new CustomEvent('question', {detail: {questionId, message, options, select}}));
	$("#question-box").modal("show");
}

export function getBsonId(item: any): string {
	if (!item)
		throw "Item is null";
	else if (!item._id) {
		console.error("Invalid item data, _id is expected:", item);
		notify('Invalid data, please check the logs!');
		return null;
	} else
		return item._id.$oid;
}

export function head_script(src) {
	if (document.querySelector("script[src='" + src + "']")) {
		return;
	}
	let script = document.createElement('script');
	script.setAttribute('src', src);
	script.setAttribute('type', 'text/javascript');
	document.head.appendChild(script)
}

export function body_script(src) {
	if (document.querySelector("script[src='" + src + "']")) {
		return;
	}
	let script = document.createElement('script');
	script.setAttribute('src', src);
	script.setAttribute('type', 'text/javascript');
	document.body.appendChild(script)
}

export function del_script(src) {
	let el = document.querySelector("script[src='" + src + "']");
	if (el) {
		el.remove();
	}
}

export function head_link(href) {
	if (document.querySelector("link[href='" + href + "']")) {
		return;
	}
	let link = document.createElement('link');
	link.setAttribute('href', href);
	link.setAttribute('rel', "stylesheet");
	link.setAttribute('type', "text/css");
	document.head.appendChild(link)
}

export function body_link(href) {
	if (document.querySelector("link[href='" + href + "']")) {
		return;
	}
	let link = document.createElement('link');
	link.setAttribute('href', href);
	link.setAttribute('rel', "stylesheet");
	link.setAttribute('type', "text/css");
	document.body.appendChild(link)
}

export function del_link(href) {
	let el = document.querySelector("link[href='" + href + "']");
	if (el) {
		el.remove();
	}
}

export function setPropertyEmbeddedError(doc: any, propName: string, error: string) {
	if (!doc) throw `setPropertyEmbeddedError doc is empty, prop:${propName}!`;
	doc._ = doc._ || {};
	doc._[propName] = doc._[propName] || {};
	(doc._[propName] as EmbeddedInfo).err = error;
}

export module appState {
	export function reset() {

	}

	export function initItem(item: any) {
		let meta: ItemMeta = item._;
		meta.state = ItemState.Normal;

	}

	export function propChanged(ref: string, oldValue: any, newValue: any) {

	}

	export function commit(data: any, done: (res: WebResponse) => void) {

	}

	export function commitAll(done: (res: WebResponse) => void) {

	}

	export function isDirty(data?: any): boolean {
		return false;
	}
}

$(document).ready(start);
export let glob = new Global();
export let st: State;
