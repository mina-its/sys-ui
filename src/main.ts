declare let WeakSet, $, axios: any;
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import {MenuItem, Constants, AppState} from "@/types";
import {
	DirFile,
	Drive,
	Keys,
	Property,
	WebResponse,
	LogType,
	NotificationInfo,
	GetOptions,
	ComponentParams,
	StatusCode,
	IError,
	Pair,
	EmbeddedInfo,
	RequestMode,
	AjaxConfig,
	WebMethod
} from "../../sys/src/types";

const st = store.state;

export function $t(text: string): string {
	return typeof (text) == "object" ? text[st.config.locale] || Object.values(text)[0] as string : text;

	// if (text[pack + "." + key]) return text[pack + "." + key];
	//
	// console.warn(`Warning: text '${pack}.${key}' not found`);
	// return key.replace(/-/g, " ");
}

export function updateStateRoot(state: AppState) {
	store.commit('updateRoot', state);
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
// 	// if (st.form.breadcrumb && st.form.breadcrumb.length > 0) {
// 	// 	let rootref = st.form.breadcrumb[0].ref;
// 	// 	let rootItem = st.navmenu.filter(item => item.ref == rootref).pop();
// 	// 	if (!rootItem)
// 	// 		rootItem = {ref: rootref, title: st.form.breadcrumb[0].title};
// 	//
// 	// 	dispatchState({navmenu : st.navmenu.filter(item => item.ref != rootItem).slice(0, 3);
// 	// 	st.navmenu.unshift(rootItem);
// 	// } else {
// 	//st.navmenu = st.navmenu.filter(item => item.ref != ref).slice(0, 8);
// 	//st.navmenu.unshift({title, ref});
// 	//}
// 	localStorage.setItem('_navmenu', JSON.stringify(st.config.navmenu));
// }

export function evalExpression($this: any, expression: string): any {
	try {
		if (expression == null) return null;
		return eval(expression.replace(/\bthis\b/g, '$this'));
	} catch (ex) {
		console.error(`Evaluating '${expression}' failed! this:`, $this, 'Error:', ex.message);
	}
}

export function initState(res: WebResponse) {
	//log("load res: ", res.data);
	let title = "";
	if (res.form) {
		updateStateRoot({form: res.form});
		title = st.form.title as string;
	}
	document.title = title;
	updateStateRoot({headFuncs: []});
	updateStateRoot({toolbar: false});
	updateStateRoot({meta: res.meta || {}});
	if (res.config) updateStateRoot({config: res.config});
	let data = res.data || {};
	for (let prop in data) {
		vueResetProperties(data[prop], prop, true);
	}

	updateStateRoot({data});
	$(".details-view").scrollTop(0);
	setNavmenu();
}

function setUndefinedToNull(item, prop: Property) {
	if (!item) return;
	if (item[prop.name] === undefined)
		item[prop.name] = null;

	if (prop.required)
		setPropertyEmbeddedError(item, prop.name, null); // to check later
}

export function vueResetProperties(data: any, name: string, resetStatus: boolean) {
	// todo
	// let meta = st.meta[name];
	// if (Array.isArray(data)) {
	// 	if (resetStatus)
	// 		data.forEach((item) => {
	// 			item._status = null;
	// 		});
	// } else {
	// 	if (data._id < 0) // new item
	// 		commitStateRoot({dirty: true});
	// }
	//
	// if (!meta || !meta.properties) return;
	// for (let prop of meta.properties) {
	// 	if (Array.isArray(data)) {
	// 		data.forEach((item) => {
	// 			setUndefinedToNull(item, prop);
	// 		});
	// 	} else {
	// 		setUndefinedToNull(data, prop);
	// 	}
	// }
}

function validateData(data, ref: string): boolean {
	// todo
	// let meta = st.meta[ref];
	// let requiredProps = meta.properties.filter(p => p.required);
	// for (let prop of requiredProps) {
	// 	if (data[prop.name] == null) {
	// 		notify(`Property '${prop.name}' is required.`, LogType.Warning);
	// 		// if (!Array.isArray(st.data[ref]))
	// 		// 	data._error = `Property '${prop.name}' is required.`;
	// 		return false;
	// 	}
	// }
	return true;
}

export function validate(): boolean {
	// todo
	// for (let ref in st.data) {
	// 	if (Array.isArray(st.data[ref])) {
	// 		for (let item of st.data[ref]) {
	// 			if (!validateData(item, ref))
	// 				return false;
	// 		}
	// 	} else if (!validateData(st.data[ref], ref))
	// 		return false;
	// }

	return true;
}

export function someProps(prop): boolean {
	return Array.isArray(prop.properties) && prop.properties.length;
}

export function commitNewItem() {
	// todo
	// let objectName = location.pathname.replace(/\//, '');
	// let data = st.data[objectName];
	// if (data._id != -1) {
	// 	notify('Invalid state, please refresh and check if the item already has been added!', LogType.Error);
	// 	return;
	// }
	// for (let ref in st.data) {
	// 	if (ref.indexOf(objectName + "/") == 0) {
	// 		data[ref.substr(objectName.length + 1)] = st.data[ref];
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

export function handleResponse(res: WebResponse) {
	res = flat2recursive(res);
	if (res.redirect)
		handleResponseRedirect(res);
	else if (res.message) {
		notify(res.message, LogType.Info);
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
			if (typeof oldValue == "object")
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
	if (typeof val == "object") {
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
			let item = meta._.items.find(i => i.ref == valItem);
			if (!item)
				values.push("...");
			else
				values.push(item.title);
		}
		return values.join(", ");
	} else {
		let item = meta._.items.find(i => i.ref == val);
		if (!item) return "...";
		return item.title;
	}
}

function refresh() {
	updateStateRoot({dirty: false});
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
	if (!items.find(i => i.hover)) {
		if (!items[0].title) {
			items[0].hover = false;
			items[1].hover = true;
		} else
			items[0].hover = true;
	}

	updateStateRoot({cmenu: {show: true, items, handler, state, top: 0, left: 0, right: 0, bottom: 0, event}});
}

export function hideCmenu() {
	store.commit('updateCMenu', {show: false});
}

function handleCmenuKeys(e) {
	switch (e.which) {
		case Keys.tab:
		case Keys.esc:
			st.cmenu.handler(st.cmenu.state, null);
			hideCmenu();
			break;

		case Keys.enter: {
			let item = st.cmenu.items.find(i => i.hover);
			if (item) {
				st.cmenu.handler(st.cmenu.state, item);
				hideCmenu();
			}
			break;
		}

		case Keys.down: {
			let item = st.cmenu.items.find(i => i.hover);
			if (!item) {
				store.commit('updateCMenuItem', {index: 0, update: {hover: true}});
			} else {
				let index = st.cmenu.items.indexOf(item);
				if (index < st.cmenu.items.length - 1) {
					store.commit('updateCMenuItem', {index: index, update: {hover: false}});
					store.commit('updateCMenuItem', {index: index + 1, update: {hover: true}});
				}
			}
			break;
		}

		case Keys.up: {
			let item = st.cmenu.items.find(i => i.hover);
			if (!item)
				store.commit('updateCMenuItem', {index: st.cmenu.items.length - 1, update: {hover: true}});
			else {
				let index = st.cmenu.items.indexOf(item);
				if (index > 0) {
					store.commit('updateCMenuItem', {index: index, update: {hover: false}});
					store.commit('updateCMenuItem', {index: index - 1, update: {hover: true}});
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
			ajax("/getPropertyReferenceValues", data, null, (res) => {
				prop._items = res.data;
			}, (err) => {
				notify(err);
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
	store.commit('updateFileGallery', {fileBrowsed});
	$("#file-browse").val("").click();
}

export function refreshFileGallery(file?: string, done?) {
	openFileGallery(st.fileGallery.drive, file, st.fileGallery.path, st.fileGallery.fixedPath, st.fileGallery.fileSelectCallback, done);
}

export function openFileGallery(drive: Drive, file: string, path: string, fixedPath: boolean, fileSelectCallback: (path: string, item: DirFile) => void, done?) {
	updateStateRoot({
		fileGallery: {
			list: [],
			loading: true,
			drive,
			file,
			path: path || "",
			fixedPath,
			selectable: true,
			fileSelectCallback: fileSelectCallback
		}
	});

	$("#file-gallery").modal("show");
	ajax('/getFileGallery?m=1', {drive: drive._id, path}, {}, (res) => {
		store.commit('updateFileGallery', {
			loading: false,
			uri: res.data.uri,
			list: res.data.list,
			selected: st.fileGallery.list.find(l => l.name == st.fileGallery.file)
		});
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

export function invoke(pack: string, name: string, args: any[]) {
	return false;
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

export function load(href) {
	if (this.state.dirty) {
		notify($t('save-before'), LogType.Warning);
		return;
	}

	this.ajax(setQs('m', RequestMode.partial, false, href), null, null, handleResponse, (err) => {
		notify(err);
	});
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

(function start() {
	let mainState = $("#main-state").html();
	let res: WebResponse = mainState ? parse(mainState) : {};
	updateStateRoot({config: res.config || {}});

	if (res.message) {
		notify(res);
	} else
		initState(res);

	Object.assign(Vue.config, {productionTip: false, devtools: true});
	Vue.directive("focus", {
		inserted(el, binding) {
			if (binding.value) el.focus();
		}
	});
	new Vue({
		store,
		render: (h) => h(App),
	}).$mount('#root');
})();
