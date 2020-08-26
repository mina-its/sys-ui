import {
    Property,
    DirFile,
    Pair,
    LogType,
    NotificationInfo,
    AppStateConfig,
    FormDto,
    IData,
    Note,
    mFile
} from '../../sys/src/types';

import Vue from 'vue'


import {ID} from 'bson-util';

export {ID};

export interface JQuery {
    (selector: string | any): any;
}

export interface Socket {
    (params: any): any;

    close: any;
    on: any;
    emit: any;
}

export interface Moment {
    (...params: any): any;

    utc;
}

export const Constants = {
    redirectBack: '_back',
    errorEmbedProperty: 'e',
    redirectSelf: '_self',
    defaultAddress: '/_default',
    contextMenuVisibleItems: 10,
    inlineMessageDuration: 5000,
    imageExtensions: ["png", "tiff", "ico", "gif", "jpg", "jpeg", "svg"],
    uniqueFilenameRegex: /^[a-fA-F0-9]{24}__/,
    QUERY_LOCALE: 'e',
    QUERY_NEW: 'n',
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

export class GlobalFunction {
    title: string;
    style?: string;
    name?: string;
    ref?: string;
    exec?: (...args: any) => void;
}

export class MenuItem {
    ref?: any;
    title: string;
    hover?: boolean;
    _cs?: string;
}

export class ExecContext {
    data?: any;
    event?: any;
    name?: string;
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
    UploadFile = 5,
    SelectFile = 6,
    DeleteFile = 7,
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

export class StartParams {
    app?: {};
    components?: { [name: string]: any; } = {};
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
    event?: any;
}

export class ItemChangeEventArg {
    item?: IData;
    type?: ChangeType;
    prop: Property;
    val: any;
    vue?: Vue;
}

export class FilterChangeEventArg {
    prop: Property;
    val: any;
    filterVal?: any;
}

export class AppStateCmenu {
    state: any;
    show: boolean;
    items: MenuItem[];
    datePicker?: {
        format: string;
        value: any;
    };
    top: number;
    bottom: number;
    left: number;
    right: number;
    event: any;
    handler: (state: any, item) => void;

    constructor() {
        this.show = false;
        this.items = [];
        this.left = 0;
        this.top = 0;
    }
}

export enum PropertyLabelMode {
    Visible = 0,
    Hidden = 1,
    PlaceHolder = 2,
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
    data: any = {};
    form: FormDto;
    infoPanel: {
        notes: Note[];
        show: boolean;
        currentComment: string;
    } = {
        notes: [],
        show: true,
        currentComment: null
    };
    question = new AppStateQuestion();
    fileGallery = new AppStateFileGallery();
    fileBrowsed: (files: mFile[]) => void = null;
    imagePreview: {
        show: boolean,
        url: string
    } = {show: false, url: null};
    logs: AppStateLog[] = [];
    modal: boolean = false;
    config = new AppStateConfig();
    texts: { [key: string]: string };
    dirty: boolean = false;
    notify: NotificationInfo = null;
    cmenu = new AppStateCmenu();
    geoMap = new AppStateGeoMap();
    modifies: Modify[] = [];
    socket: Socket;
    showProgress: boolean = false;
    showNavMenu: boolean = true;
    screen: ScreenSize = ScreenSize.md;
    inlineMessage: string = null;

    // Service specific data
    service = null;
}

export enum ScreenSize {
    xs = 1, // (for phones - screens less than 768px wide)
    sm = 2, // (for tablets - screens equal to or greater than 768px wide)
    md = 3,//  (for small laptops - screens equal to or greater than 992px wide)
    lg = 4,// (for laptops and desktops - screens equal to or greater than 1200px wide)
}

export class Modify {
    type: ChangeType;
    ref: string;
    data?: any;
    state: any;
}

export enum FilterOperator {
    Select = "[select]",
    Equal = "eq",
    NotEqual = "ne",
    Yes = "ye",
    No = "no",
    NotNull = "nn",
    Null = "nl",
    GreaterThan = "gt",
    GreaterThanEqual = "gte",
    LessThan = "lt",
    LessThanEqual = "lte",
    Like = "lk",
    In = "in",
    NotIn = "nin",
    StartWith = "sw",
    EndWith = "ew",
    None = "none",
    Exist = "exists"
}

export class AppStateFileGallery {
    drive: ID;
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
}

export class QuestionOptions {
    questionId: string;
}

export class AppStateQuestion {
    title: string;
    message: string;
    buttons: Pair[] = [];
    show: boolean = false;
    options: QuestionOptions;
    select: (ref: string) => void;
}

export class AppStateLog {
    message?: string;
    ref?: string;
    type?: LogType;
}
