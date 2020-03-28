import {
	Property,
	WebMethod,
	Form,
	Drive,
	DirFile,
	Pair,
	LogType,
	NotificationInfo,
	AppStateConfig
} from "../../sys/src/types";

export const Constants = {
	redirectBack: "_back",
	redirectSelf: "_self",
};

export const ChartColors = [
	'rgba(54, 162, 235, 0.8)',//blue:
	'rgba(255, 99, 132, 0.8)', //red:
	'rgba(75, 192, 192, 0.8)',//green:
	'rgba(255, 159, 64, 0.8)', //orange:
	'rgba(255, 205, 86, 0.8)',//yellow:
	'rgba(153, 102, 255, 0.8)',//purple:
	'rgba(231,233,237, 0.8)'//grey:
];

export class HeadFunc {
	title: string;
	name: string;
	exec: (...args: any) => void;
}

export class MenuItem {
	ref?: any;
	title: string;
	hover?: boolean;
	icon?: string;
}

export class Modify {
	data: any;
	type: WebMethod;
	ref: string;
}

export class AppStateGeoMap {
	constructor() {
		this.show = false;
	}

	marker: any;
	show: boolean;
	val: { x: number, y: number, z: number };
	select: (val) => void;
}

export enum RowStatus {
	Selected = 1,
}

export class AppStateCmenu {
	constructor() {
		this.show = false;
		this.items = [];
		this.left = 0;
		this.top = 0;
	}

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

export class Global {
	constructor() {
		this.fileGallery = new AppStateFileGallery();
		this.question = new AppStateQuestion();
		this.modal = false;
		this.headFuncs = [];
		this.config = new AppStateConfig();
		this.cmenu = new AppStateCmenu();
		this.geoMap = new AppStateGeoMap();
		this.modifies = [];
		this.dirty = false;
	}

	form: Form;
	data: any;
	question: AppStateQuestion;
	fileGallery: AppStateFileGallery;
	logs: AppStateLog[];
	modal: boolean;
	headFuncs: HeadFunc[];
	config: AppStateConfig;
	dirty: boolean;
	notify?: NotificationInfo;
	cmenu: AppStateCmenu;
	geoMap: AppStateGeoMap;
	modifies: Modify[];
}

export class AppStateFileGallery {
	constructor() {
		this.path = "";
		this.list = [];
		this.file = '';
		this.loading = false;
		this.fixedPath = false;
		this.uri = '';
	}

	drive: Drive;
	path: string;
	list: DirFile[];
	file: string;
	selectable: boolean;
	loading: boolean;
	fixedPath: boolean;
	selected?: DirFile;
	uri?: string;
	fileSelectCallback: (path: string, item: DirFile) => void;
	fileBrowsed?: (files: any[]) => void;
}

export class AppStateQuestion {
	constructor() {
		this.options = [];
	}

	message: string;
	options: [];
	questionId: string;
	select: (item: Pair) => void;
}

export class AppStateLog {
	message?: string;
	ref?: string;
	type?: LogType;
}

