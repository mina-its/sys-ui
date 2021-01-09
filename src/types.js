"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppStateLog = exports.AppStateQuestion = exports.QuestionOptions = exports.AppStateFileGallery = exports.FilterOperator = exports.Modify = exports.ScreenSize = exports.Global = exports.TreeViewAttribute = exports.TreeViewLine = exports.TreeViewNode = exports.PropertyLabelMode = exports.AppStateCmenu = exports.FilterChangeEventArg = exports.ItemChangeEventArg = exports.FunctionExecEventArg = exports.ItemEventArg = exports.PropEventArg = exports.StartParams = exports.AppStateGeoMap = exports.ChangeType = exports.StateChange = exports.ExecContext = exports.MenuItem = exports.GlobalFunction = exports.ChartColors = exports.Constants = exports.ID = void 0;
const types_1 = require("../../sys/src/types");
const bson_util_1 = require("bson-util");
Object.defineProperty(exports, "ID", { enumerable: true, get: function () { return bson_util_1.ID; } });
exports.Constants = {
    redirectBack: '_back',
    errorEmbedProperty: 'e',
    redirectSelf: '_self',
    contextMenuVisibleItems: 10,
    inlineMessageDuration: 5000,
    imageExtensions: ["png", "tiff", "ico", "gif", "jpg", "jpeg", "svg"],
    Jalali_Months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"],
    Jalali_Week_Days: ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"],
    uniqueFilenameRegex: /^[a-fA-F0-9]{24}__/,
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
class GlobalFunction {
}
exports.GlobalFunction = GlobalFunction;
class MenuItem {
}
exports.MenuItem = MenuItem;
class ExecContext {
}
exports.ExecContext = ExecContext;
class StateChange {
}
exports.StateChange = StateChange;
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["EditProp"] = 1] = "EditProp";
    ChangeType[ChangeType["InsertItem"] = 2] = "InsertItem";
    ChangeType[ChangeType["DeleteItem"] = 3] = "DeleteItem";
    ChangeType[ChangeType["UploadFile"] = 5] = "UploadFile";
    ChangeType[ChangeType["SelectFile"] = 6] = "SelectFile";
    ChangeType[ChangeType["DeleteFile"] = 7] = "DeleteFile";
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
    PropertyLabelMode[PropertyLabelMode["Visible"] = 0] = "Visible";
    PropertyLabelMode[PropertyLabelMode["Hidden"] = 1] = "Hidden";
    PropertyLabelMode[PropertyLabelMode["PlaceHolder"] = 2] = "PlaceHolder";
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
        this.infoPanel = {
            notes: [],
            show: true,
            currentComment: null
        };
        this.question = new AppStateQuestion();
        this.fileGallery = new AppStateFileGallery();
        this.fileBrowsed = null;
        this.imagePreview = { show: false, url: null };
        this.logs = [];
        this.modal = false;
        this.config = new types_1.AppStateConfig();
        this.dirty = false;
        this.notify = null;
        this.cmenu = new AppStateCmenu();
        this.geoMap = new AppStateGeoMap();
        this.modifies = [];
        this.showProgress = false;
        this.showNavMenu = true;
        this.screen = ScreenSize.md;
        this.inlineMessage = null;
        // Service specific data
        this.service = null;
    }
}
exports.Global = Global;
var ScreenSize;
(function (ScreenSize) {
    ScreenSize[ScreenSize["xs"] = 1] = "xs";
    ScreenSize[ScreenSize["sm"] = 2] = "sm";
    ScreenSize[ScreenSize["md"] = 3] = "md";
    ScreenSize[ScreenSize["lg"] = 4] = "lg";
})(ScreenSize = exports.ScreenSize || (exports.ScreenSize = {}));
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