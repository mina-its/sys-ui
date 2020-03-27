export const ChartColors = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(255, 205, 86, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(231,233,237, 0.8)' //grey:
];
export class Global {
    constructor() {
        this.md = [];
        this.counter = 1;
    }
}
export class State {
}
export class HeadFunc {
}
export class MenuItem {
}
export class Modify {
}
export class StateGeoMap {
}
export var RowStatus;
(function (RowStatus) {
    RowStatus[RowStatus["Selected"] = 1] = "Selected";
})(RowStatus || (RowStatus = {}));
export class StateCmenu {
}
export const Constants = {
    redirectBack: "_back",
    redirectSelf: "_self",
};
export var Gmode;
(function (Gmode) {
    Gmode[Gmode["noGrouping"] = 0] = "noGrouping";
    Gmode[Gmode["grouped"] = 1] = "grouped";
    Gmode[Gmode["sideMenu"] = 2] = "sideMenu";
})(Gmode || (Gmode = {}));
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
//# sourceMappingURL=types.js.map