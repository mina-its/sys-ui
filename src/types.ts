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
import Prop from "@/components/Prop.vue";

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

export class StateChange {
    type: StateChangeType;
    prop?: string;
    value?: any;
    item: any;
    uri: string;
    vue: Vue;
}

export enum StateChangeType {
    Patch = 1,
    Insert = 2,
    Delete = 3,
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

export class PropChangedEventArg {
    prop: Property;
    val: any;
    vue?: Vue;
}

export class FunctionExecEventArg {
    then?: () => void;
    data?: any;
    name?: string;
}

export class ItemPropChangedEventArg {
    item: any;
    prop: Property;
    val: any;
    vue?: Vue;
}

export class ItemEventArg {
    item: any;
    event?: any;
}

export class PropKeydownEventArg {
    item: any;
    event: any;
    prop: Property;
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

export class Global {
    data: any;
    form: FormDto;
    question = new AppStateQuestion();
    fileGallery = new AppStateFileGallery();
    logs: AppStateLog[];
    modal: boolean = false;
    headFuncs: HeadFunc[] = [];
    config = new AppStateConfig();
    dirty: boolean = false;
    notify: NotificationInfo = null;
    cmenu = new AppStateCmenu();
    geoMap = new AppStateGeoMap();
    modifies: Modify[] = [];
    socket: any;
}

export class Modify {
    type: WebMethod;
    ref: string;
    data?: any;
    state: any;
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
