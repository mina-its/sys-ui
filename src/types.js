"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = exports.AppStateLog = exports.AppStateQuestion = exports.FileActionType = exports.FileAction = exports.QuestionOptions = exports.AppStateFileGallery = exports.FilterOperator = exports.Modify = exports.Global = exports.TreeViewAttribute = exports.TreeViewLine = exports.TreeViewNode = exports.PropertyLabelMode = exports.AppStateCmenu = exports.FilterChangeEventArg = exports.ItemChangeEventArg = exports.FunctionExecEventArg = exports.ItemEventArg = exports.PropEventArg = exports.StartParams = exports.AppStateGeoMap = exports.ChangeType = exports.StateChange = exports.MenuItem = exports.HeadFunc = exports.ChartColors = exports.Constants = void 0;
const types_1 = require("../../sys/src/types");
const bson_util_1 = require("bson-util");
Object.defineProperty(exports, "ID", { enumerable: true, get: function () { return bson_util_1.ID; } });
exports.Constants = {
    redirectBack: '_back',
    errorEmbedProperty: 'e',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    defaultAddress: '/_default',
    questionEvent: 'question',
    contextMenuVisibleItems: 10,
    delayToStartProgressBar: 300,
    imageExtensions: ["png", "tiff", "ico", "gif", "jpg", "jpeg"],
    uniqueFilenameRegex: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}__/,
    QUERY_LOCALE: 'e',
    QUERY_NEW: 'n',
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
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["EditProp"] = 1] = "EditProp";
    ChangeType[ChangeType["InsertItem"] = 2] = "InsertItem";
    ChangeType[ChangeType["DeleteItem"] = 3] = "DeleteItem";
    ChangeType[ChangeType["EditFileProp"] = 4] = "EditFileProp";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
class AppStateGeoMap {
    constructor() {
        this.show = false;
    }
}
exports.AppStateGeoMap = AppStateGeoMap;
class StartParams {
    constructor() {
        this.components = {};
    }
}
exports.StartParams = StartParams;
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
class FilterChangeEventArg {
}
exports.FilterChangeEventArg = FilterChangeEventArg;
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
        this.data = {};
        this.question = new AppStateQuestion();
        this.fileGallery = new AppStateFileGallery();
        this.logs = [];
        this.modal = false;
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
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["Select"] = "[select]";
    FilterOperator["Equal"] = "eq";
    FilterOperator["NotEqual"] = "ne";
    FilterOperator["Yes"] = "ye";
    FilterOperator["No"] = "no";
    FilterOperator["NotNull"] = "nn";
    FilterOperator["Null"] = "nl";
    FilterOperator["GreaterThan"] = "gt";
    FilterOperator["GreaterThanEqual"] = "gte";
    FilterOperator["LessThan"] = "lt";
    FilterOperator["LessThanEqual"] = "lte";
    FilterOperator["Like"] = "lk";
    FilterOperator["In"] = "in";
    FilterOperator["NotIn"] = "nin";
    FilterOperator["StartWith"] = "sw";
    FilterOperator["EndWith"] = "ew";
    FilterOperator["None"] = "none";
    FilterOperator["Exist"] = "exists";
})(FilterOperator = exports.FilterOperator || (exports.FilterOperator = {}));
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
class QuestionOptions {
}
exports.QuestionOptions = QuestionOptions;
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
        this.buttons = [];
        this.show = false;
    }
}
exports.AppStateQuestion = AppStateQuestion;
class AppStateLog {
}
exports.AppStateLog = AppStateLog;
//# sourceMappingURL=types.js.map