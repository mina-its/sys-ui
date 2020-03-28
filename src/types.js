"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(231,233,237, 0.8)'
];
class Global {
    constructor() {
        this.md = [];
        this.counter = 1;
    }
}
exports.Global = Global;
class State {
}
exports.State = State;
class HeadFunc {
}
exports.HeadFunc = HeadFunc;
class MenuItem {
}
exports.MenuItem = MenuItem;
class Modify {
}
exports.Modify = Modify;
class StateGeoMap {
}
exports.StateGeoMap = StateGeoMap;
var RowStatus;
(function (RowStatus) {
    RowStatus[RowStatus["Selected"] = 1] = "Selected";
})(RowStatus = exports.RowStatus || (exports.RowStatus = {}));
class StateCmenu {
}
exports.StateCmenu = StateCmenu;
exports.Constants = {
    redirectBack: "_back",
    redirectSelf: "_self",
};
var Gmode;
(function (Gmode) {
    Gmode[Gmode["noGrouping"] = 0] = "noGrouping";
    Gmode[Gmode["grouped"] = 1] = "grouped";
    Gmode[Gmode["sideMenu"] = 2] = "sideMenu";
})(Gmode = exports.Gmode || (exports.Gmode = {}));
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
//# sourceMappingURL=types.js.map