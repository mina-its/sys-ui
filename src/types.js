import { AppStateConfig } from '../../sys/src/types';
export const Constants = {
    redirectBack: '_back',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    questionEvent: 'question',
};
export const ChartColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(231,233,237, 0.8)' // grey:
];
export class HeadFunc {
}
export class MenuItem {
}
export class StateChange {
}
export var StateChangeType;
(function (StateChangeType) {
    StateChangeType[StateChangeType["Patch"] = 1] = "Patch";
    StateChangeType[StateChangeType["Insert"] = 2] = "Insert";
    StateChangeType[StateChangeType["Delete"] = 3] = "Delete";
})(StateChangeType || (StateChangeType = {}));
export class AppStateGeoMap {
    constructor() {
        this.show = false;
    }
}
export class PropChangedEventArg {
}
export class ItemPropChangedEventArg {
}
export class AppStateCmenu {
    constructor() {
        this.show = false;
        this.items = [];
        this.left = 0;
        this.top = 0;
    }
}
export var PropertyLabelMode;
(function (PropertyLabelMode) {
    PropertyLabelMode[PropertyLabelMode["Hidden"] = 1] = "Hidden";
    PropertyLabelMode[PropertyLabelMode["Visible"] = 2] = "Visible";
})(PropertyLabelMode || (PropertyLabelMode = {}));
export var DiffKind;
(function (DiffKind) {
    DiffKind["newlyAdded"] = "N";
    DiffKind["edited"] = "E";
    DiffKind["deleted"] = "D";
    DiffKind["arrayChange"] = "A";
})(DiffKind || (DiffKind = {}));
export class TreeViewNode {
}
export class TreeViewLine {
}
export class TreeViewAttribute {
}
export class ApiDocParameter {
}
export class ApiDocOperation {
}
export class ApiDocBlock {
    constructor() {
        this.operations = [];
    }
}
export class ApiDocSchema {
}
export class ApiDocEnum {
}
export class ApiDoc {
    constructor() {
        this.blocks = [];
        this.schemas = [];
        this.enums = [];
    }
}
export class Global {
    constructor() {
        this.question = new AppStateQuestion();
        this.fileGallery = new AppStateFileGallery();
        this.modal = false;
        this.headFuncs = [];
        this.config = new AppStateConfig();
        this.dirty = false;
        this.notify = null;
        this.cmenu = new AppStateCmenu();
        this.geoMap = new AppStateGeoMap();
        this.modifies = [];
    }
}
export class Modify {
}
export class AppStateFileGallery {
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
    constructor() {
        this.options = [];
    }
}
export class AppStateLog {
}
//# sourceMappingURL=types.js.map