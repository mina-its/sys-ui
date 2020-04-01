import {
    Property,
    WebMethod,
    Drive,
    DirFile,
    Pair,
    LogType,
    NotificationInfo,
    AppStateConfig,
    FormDto
} from '../../sys/src/types';

export const Constants = {
    redirectBack: '_back',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    questionEvent: 'question',
};

export const ChartColors = [
    'rgba(54, 162, 235, 0.8)',  // blue:
    'rgba(255, 99, 132, 0.8)',  // red:
    'rgba(75, 192, 192, 0.8)',  // green:
    'rgba(255, 159, 64, 0.8)',  // orange:
    'rgba(255, 205, 86, 0.8)',  // yellow:
    'rgba(153, 102, 255, 0.8)', // purple:
    'rgba(231,233,237, 0.8)'    // grey:
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
    marker?: any;
    show: boolean;
    val: { x: number, y: number, z: number };
    select: (val) => void;

    constructor() {
        this.show = false;
    }
}

export class AppStateCmenu {
    state: any;
    show: boolean;
    items: MenuItem[];
    top: number;
    bottom: number;
    left: number;
    right: number;
    event: any;
    handler: (state, item) => void;

    constructor() {
        this.show = false;
        this.items = [];
        this.left = 0;
        this.top = 0;
    }
}

export enum PropertyLabelMode {
    Hidden = 1,
    Visible = 2,
}

export enum DiffKind {
    newlyAdded = 'N', //  // newly added property/element
    edited = 'E', // property/element was edited
    deleted = 'D', // property/element was deleted
    arrayChange = 'A',
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
    properties: Array<{
        name: string;
        type: string;
        required: boolean;
    }>;
}

export class ApiDocEnum {
    title: string;
    name: string;
    items: Array<{
        name: string;
        value: number;
    }>;
}

export class ApiDoc {
    version: string;
    uriPrefix: string;
    blocks: ApiDocBlock[] = [];
    schemas: ApiDocSchema[] = [];
    enums: ApiDocEnum[] = [];
}

export class Global {
    form: FormDto;
    data: any;
    question: AppStateQuestion;
    fileGallery: AppStateFileGallery;
    logs: AppStateLog[];
    modal: boolean;
    headFuncs: HeadFunc[];
    config: AppStateConfig;
    dirty: boolean;
    notify: NotificationInfo;
    cmenu: AppStateCmenu;
    geoMap: AppStateGeoMap;
    modifies: Modify[];
    socket: any;

    constructor() {
        this.fileGallery = new AppStateFileGallery();
        this.question = new AppStateQuestion();
        this.modal = false;
        this.headFuncs = [];
        this.config = new AppStateConfig();
        this.cmenu = new AppStateCmenu();
        this.geoMap = new AppStateGeoMap();
        this.notify = null;
        this.modifies = [];
        this.dirty = false;
    }
}

export class AppStateFileGallery {
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

    constructor() {
        this.path = '';
        this.list = [];
        this.file = '';
        this.loading = false;
        this.fixedPath = false;
        this.uri = '';
    }
}

export class AppStateQuestion {
    message: string;
    options: [];
    questionId: string;
    select: (item: Pair) => void;

    constructor() {
        this.options = [];
    }
}

export class AppStateLog {
    message?: string;
    ref?: string;
    type?: LogType;
}
