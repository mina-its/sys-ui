"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../sys/src/types");
exports.Constants = {
    redirectBack: '_back',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    questionEvent: 'question',
    contextMenuVisibleItems: 10,
    delayToStartProgressBar: 300,
    imageExtensions: ["png", "tiff", "ico", "gif", "jpg", "jpeg"],
};
exports.ChartColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(231,233,237, 0.8)' // grey:
];
class HeadFunc {
}
exports.HeadFunc = HeadFunc;
class MenuItem {
}
exports.MenuItem = MenuItem;
class StateChange {
}
exports.StateChange = StateChange;
var StateChangeType;
(function (StateChangeType) {
    StateChangeType[StateChangeType["Patch"] = 1] = "Patch";
    StateChangeType[StateChangeType["Insert"] = 2] = "Insert";
    StateChangeType[StateChangeType["Delete"] = 3] = "Delete";
})(StateChangeType = exports.StateChangeType || (exports.StateChangeType = {}));
class AppStateGeoMap {
    constructor() {
        this.show = false;
    }
}
exports.AppStateGeoMap = AppStateGeoMap;
class PropEventArg {
}
exports.PropEventArg = PropEventArg;
class ItemEventArg {
}
exports.ItemEventArg = ItemEventArg;
class FunctionExecEventArg {
}
exports.FunctionExecEventArg = FunctionExecEventArg;
class ItemChangeEventArg {
}
exports.ItemChangeEventArg = ItemChangeEventArg;
class AppStateCmenu {
    constructor() {
        this.show = false;
        this.items = [];
        this.left = 0;
        this.top = 0;
    }
}
exports.AppStateCmenu = AppStateCmenu;
var PropertyLabelMode;
(function (PropertyLabelMode) {
    PropertyLabelMode[PropertyLabelMode["Hidden"] = 1] = "Hidden";
    PropertyLabelMode[PropertyLabelMode["Visible"] = 2] = "Visible";
})(PropertyLabelMode = exports.PropertyLabelMode || (exports.PropertyLabelMode = {}));
var DiffKind;
(function (DiffKind) {
    DiffKind["newlyAdded"] = "N";
    DiffKind["edited"] = "E";
    DiffKind["deleted"] = "D";
    DiffKind["arrayChange"] = "A";
})(DiffKind = exports.DiffKind || (exports.DiffKind = {}));
class TreeViewNode {
}
exports.TreeViewNode = TreeViewNode;
class TreeViewLine {
}
exports.TreeViewLine = TreeViewLine;
class TreeViewAttribute {
}
exports.TreeViewAttribute = TreeViewAttribute;
class Global {
    constructor() {
        this.question = new AppStateQuestion();
        this.fileGallery = new AppStateFileGallery();
        this.modal = false;
        this.headFuncs = [];
        this.config = new types_1.AppStateConfig();
        this.dirty = false;
        this.notify = null;
        this.cmenu = new AppStateCmenu();
        this.geoMap = new AppStateGeoMap();
        this.modifies = [];
        this.progress = null;
    }
}
exports.Global = Global;
class Modify {
}
exports.Modify = Modify;
class AppStateFileGallery {
    constructor() {
        this.path = '';
        this.list = [];
        this.file = '';
        this.show = false;
        this.loading = false;
        this.fixedPath = false;
        this.uri = '';
    }
}
exports.AppStateFileGallery = AppStateFileGallery;
class FileAction {
}
exports.FileAction = FileAction;
var FileActionType;
(function (FileActionType) {
    FileActionType[FileActionType["Upload"] = 1] = "Upload";
    FileActionType[FileActionType["Select"] = 2] = "Select";
    FileActionType[FileActionType["Delete"] = 3] = "Delete";
})(FileActionType = exports.FileActionType || (exports.FileActionType = {}));
class AppStateQuestion {
    constructor() {
        this.options = [];
        this.show = false;
    }
}
exports.AppStateQuestion = AppStateQuestion;
class AppStateLog {
}
exports.AppStateLog = AppStateLog;
//# sourceMappingURL=types.js.map