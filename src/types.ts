import {
	Pair,
	Property,
	Form,
	WebMethod,
	DirFile,
	Drive,
	LogType,
	NotificationInfo,
	ObjectMeta,
	FunctionMeta
} from "../../sys/src/types";

export const ChartColors = [
	'rgba(54, 162, 235, 0.8)',//blue:
	'rgba(255, 99, 132, 0.8)', //red:
	'rgba(75, 192, 192, 0.8)',//green:
	'rgba(255, 159, 64, 0.8)', //orange:
	'rgba(255, 205, 86, 0.8)',//yellow:
	'rgba(153, 102, 255, 0.8)',//purple:
	'rgba(231,233,237, 0.8)'//grey:
];

export class Global {
	od: any;
	md: Modify[] = [];
	counter = 1;
	onReady: () => void;
	io: any;
}

export class State {
	form: Form;
	data: any;
	meta: ObjectMeta | FunctionMeta;
	toolbar: boolean;
	dirty: boolean;
	notify: NotificationInfo;
	logs: {
		message?: string;
		ref?: string;
		type?: LogType;
	}[];
	cmenu: StateCmenu;
	question: {
		questionId: string;
		message: string;
		options: Pair[];
		select: (item: Pair) => void;
	};
	menu: any[];
	modal: boolean;
	navmenu: any[];
	config: {
		locale: string;
		interactive: boolean;
		appLocales: Pair[];
		brandingLogo: string;
		appTitle: string;
		loginRef: string;
		loginTitle: string;
	};
	fileGallery: {
		drive: Drive;
		file: string;
		path: string;
		loading: boolean;
		fixedPath: boolean;
		selectable: boolean;
		selected: DirFile;
		uri: string;
		list: DirFile[];
		fileSelectCallback?: (path: string, item: DirFile) => void;
		fileBrowsed?: (files: any[]) => void;
	};
	geoMap: StateGeoMap;
	headFuncs: HeadFunc[];
}

export class HeadFunc {
	title: string;
	name: string;
	exec: () => void;
}

export class MenuItem {
	ref?: any;
	title: string;
	hover?: boolean;
	icon?: string;
}

export class Modify {
	data: any;
	item: any;
	type: WebMethod;
	rootRef: string;
	ref: string;
}

export class StateGeoMap {
	marker?: any;
	show: boolean;
	val: { x: number, y: number, z: number };
	select: (val) => void;
}

export enum RowStatus {
	Selected = 1,
}

export class StateCmenu {
	state: any;
	show: boolean;
	items: MenuItem[];
	top: number;
	bottom: number;
	left: number;
	right: number;
	event: any;
	handler: (state, item) => void;
}

export const Constants = {
	redirectBack: "_back",
	redirectSelf: "_self",
};

export enum Gmode {
	noGrouping = 0,
	grouped = 1,
	sideMenu = 2,
}

export enum PropertyLabelMode {
	Hidden = 1,
	Visible = 2,
}

export enum DiffKind {
	newlyAdded = 'N', //  // newly added property/element
	edited = 'E', // property/element was edited
	deleted = 'D', // property/element was deleted
	arrayChange = 'A'
}

export class TreeViewNode {
	line: TreeViewLine;
	nodes?: TreeViewNode[];
}

export class TreeViewLine {
	head: string;
	subject: Property;
	item: any;
	attrs?: TreeViewAttribute[];
}

export class TreeViewAttribute {
	prop: Property;
	item: any;
}

export class ApiDocParameter {
	title: string;
	name: string;
	type: string;
	required: boolean;
	comment: string;
}

export class ApiDocOperation {
	method: WebMethod;
	uri: string;
	comment: string;
	params: ApiDocParameter[];
}

export class ApiDocBlock {
	title: string;
	name: string;
	operations: ApiDocOperation[] = [];
}

export class ApiDocSchema {
	name: string;
	properties: {
		name: string;
		type: string;
		required: boolean;
	}[];
}

export class ApiDocEnum {
	title: string;
	name: string;
	items: {
		name: string;
		value: number;
	}[];
}

export class ApiDoc {
	version: string;
	uriPrefix: string;
	blocks: ApiDocBlock[] = [];
	schemas: ApiDocSchema[] = [];
	enums: ApiDocEnum[] = [];
}
