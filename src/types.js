"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../sys/src/types");
exports.Constants = {
    redirectBack: '_back',
    redirectSelf: '_self',
    notifyEvent: 'notify',
    questionEvent: 'question',
};
exports.ChartColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(231,233,237, 0.8)'
];
class HeadFunc {
}
exports.HeadFunc = HeadFunc;
class MenuItem {
}
exports.MenuItem = MenuItem;
class Modify {
}
exports.Modify = Modify;
class AppStateGeoMap {
    constructor() {
        this.show = false;
    }
}
exports.AppStateGeoMap = AppStateGeoMap;
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
class ApiDocParameter {
}
exports.ApiDocParameter = ApiDocParameter;
class ApiDocOperation {
}
exports.ApiDocOperation = ApiDocOperation;
class ApiDocBlock {
    constructor() {
        this.operations = [];
    }
}
exports.ApiDocBlock = ApiDocBlock;
class ApiDocSchema {
}
exports.ApiDocSchema = ApiDocSchema;
class ApiDocEnum {
}
exports.ApiDocEnum = ApiDocEnum;
class ApiDoc {
    constructor() {
        this.blocks = [];
        this.schemas = [];
        this.enums = [];
    }
}
exports.ApiDoc = ApiDoc;
class Global {
    constructor() {
        this.fileGallery = new AppStateFileGallery();
        this.question = new AppStateQuestion();
        this.modal = false;
        this.headFuncs = [];
        this.config = new types_1.AppStateConfig();
        this.cmenu = new AppStateCmenu();
        this.geoMap = new AppStateGeoMap();
        this.notify = null;
        this.modifies = [];
        this.dirty = false;
    }
}
exports.Global = Global;
class AppStateFileGallery {
    constructor() {
        this.path = '';
        this.list = [];
        this.file = '';
        this.loading = false;
        this.fixedPath = false;
        this.uri = '';
    }
}
exports.AppStateFileGallery = AppStateFileGallery;
class AppStateQuestion {
    constructor() {
        this.options = [];
    }
}
exports.AppStateQuestion = AppStateQuestion;
class AppStateLog {
}
exports.AppStateLog = AppStateLog;
//# sourceMappingURL=types.js.map