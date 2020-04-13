import {
    Property,
    WebMethod,
    Drive,
    DirFile,
    Pair,
    LogType,
    NotificationInfo,
    AppStateConfig,
    FormDto,
    IData,
    mFile
} from '../../sys/src/types';
import Prop from "@/components/Prop.vue";

export const Constants = {
    redirectBack: '_back',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    defaultAddress: '/_default',
    questionEvent: 'question',
    contextMenuVisibleItems: 10,
    delayToStartProgressBar: 300,
    imageExtensions: ["png", "tiff", "ico", "gif", "jpg", "jpeg"],
    uniqueFilenameRegex: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}__/,
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
    type: ChangeType;
    prop?: Property;
    value?: any;
    item: any;
    uri: string;
    vue: Vue;
}

export enum ChangeType {
    EditProp = 1,
    InsertItem = 2,
    DeleteItem = 3,
    EditFileProp = 4,
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

export class PropEventArg {
    prop: Property;
    event: any;
}

export class ItemEventArg {
    item: IData;
    prop?: Property;
    event?: any;
}

export class FunctionExecEventArg {
    stopProgress?: () => void;
    data?: any;
    name?: string;
}

export class ItemChangeEventArg {
    item?: any;
    prop: Property;
    val: any;
    vue?: Vue;
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
    logs: AppStateLog[] = [];
    modal: boolean = false;
    headFuncs: HeadFunc[] = [];
    config = new AppStateConfig();
    texts: { [key: string]: string };
    dirty: boolean = false;
    notify: NotificationInfo = null;
    cmenu = new AppStateCmenu();
    geoMap = new AppStateGeoMap();
    modifies: Modify[] = [];
    socket: any;
    progress: number = null;
}

export class Modify {
    type: ChangeType;
    ref: string;
    data?: any;
    state: any;
}

export class AppStateFileGallery {
    drive: Drive;
    path: string = '';
    list: DirFile[] = [];
    file: string = '';
    show?: boolean = false;
    selectable: boolean;
    loading: boolean = false;
    fixedPath: boolean = false;
    selected?: DirFile;
    uri?: string = '';
    fileSelectCallback: (path: string, item: DirFile) => void;
    fileBrowsed?: (files: FileList) => void;
}

export class FileAction {
    item: IData;
    val: any;
    prop: Property;
    type: FileActionType;
}

export enum FileActionType {
    Upload = 1,
    Select = 2,
    Delete = 3,
}

export class AppStateQuestion {
    message: string;
    options: [] = [];
    show: boolean = false;
    questionId: string;
    select: (item: Pair) => void;
}

export class AppStateLog {
    message?: string;
    ref?: string;
    type?: LogType;
}
