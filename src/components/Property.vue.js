"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
lang;
"ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const types_2 = require("@/types");
const main_1 = require("@/main");
const main = tslib_1.__importStar(require("../main"));
let Property = /** @class */ (() => {
    let Property = class Property extends vue_property_decorator_1.Vue {
        render(ce) {
            if (!this.prop) {
                console.error("error rendering 'Property' component. prop is empty! item:", this.item);
                return ce('div', '...');
            }
            this.prop._ = this.prop._ || { gtype: types_1.GlobalType.string };
            if (this.prop.condition && !main.evalExpression(this.item, this.prop.condition))
                return null;
            switch (this.viewType) {
                case types_1.ObjectViewType.GridView:
                    return this.renderValue(ce, "px-2 py-1");
                default:
                case types_1.ObjectViewType.DetailsView:
                    return this.renderDetailsView(ce);
                case types_1.ObjectViewType.TreeView:
                    return this.renderTreeView(ce);
            }
        }
        changed(e) {
            if (!this.readonly)
                this.raiseChanged(e);
        }
        raiseChanged(e) {
            main.setPropertyEmbeddedError(this.item, e.prop.name, null);
            return { prop: e.prop, item: this.item, val: e.val, vue: e.vue };
        }
        focused(e) {
            return { e, prop: this.prop };
        }
        keydown(e) {
            return e;
        }
        renderDetailsView(ce) {
            let valueClass = `prop-value border`;
            if (this.prop._.gtype == types_1.GlobalType.object && !this.prop.documentView) {
                return ce('object-view', {
                    props: {
                        root: false,
                        level: this.level,
                        elem: { type: types_1.ElemType.Object, obj: { _: { ref: this.prop._.ref } } }
                    },
                });
            }
            let vl = this.renderValue(ce, valueClass);
            let embedErr = main_1.getPropertyEmbedError(this.item, this.prop.name);
            let msg = null;
            if (embedErr)
                msg = ce('prop-message', { props: { message: embedErr } });
            let title = this.prop.title || this.prop.name;
            let lbl = (main.someProps(this.prop)) ? null : ce('label', { attrs: { "class": "prop-label align-top pt-2" } }, title);
            let children = this.prop._.gtype == types_1.GlobalType.boolean ? [vl] : [lbl, vl, msg];
            // Property comment
            if (this.prop.comment) {
                let cmt = this.prop.commentStyle ?
                    ce('span', { attrs: { "class": "prop-comment " + this.prop.commentStyle }, domProps: { 'innerHTML': main.markDown(this.prop.comment) } })
                    :
                        ce('p', { attrs: { "class": "prop-comment prop-comment-default mt-3 p-2" } }, [
                            ce('i', { attrs: { "class": "fa fa-info-circle m-1 fa-lg" } }),
                            ce('span', { attrs: { "class": "ml-3" }, domProps: { 'innerHTML': main.markDown(this.prop.comment) } }),
                        ]);
                if (this.prop.commentStyle && this.prop.commentStyle.indexOf(types_2.Constants.commentBeforeTag) > -1) // Comment before
                    children.unshift(cmt);
                else
                    children.push(cmt);
            }
            return ce('div', { attrs: { "class": "form-group" } }, children);
        }
        renderTreeView(ce) {
            let valueClass = "prop-value mx-2";
            let vl = this.renderValue(ce, valueClass);
            let msg = ce('prop-message', { props: { "message": this.item._error } });
            let cmt = this.prop.comment ? ce('small', { attrs: { "class": "property-comment p-3 text-muted d-block" } }, this.prop.comment) : null;
            let title = this.prop.title || this.prop.name;
            let lbl = this.labelMode == types_2.PropertyLabelMode.Hidden ? null : (main.someProps(this.prop)) ? null : ce('label', { attrs: { "class": "mr-1 tree-view-attr-label" } }, title + ":");
            let styles = "d-inline-block";
            if (this.prop._.gtype == types_1.GlobalType.boolean)
                return ce('div', { attrs: { "class": styles + " form-check" } }, [ce('label', { attrs: { "class": "col-sm-8 tree-view-attr-label" } }, [vl, title]), cmt]);
            else
                return ce('div', { attrs: { "class": styles } }, [lbl, vl, msg, cmt]);
        }
        renderValue(ce, styles) {
            let pr = {
                doc: this.item, name: this.prop.name, prop: this.prop, viewType: this.viewType,
                styles,
                readOnly: this.readonly || this.prop.editMode == types_1.PropertyEditMode.Readonly || (this.prop.editMode == types_1.PropertyEditMode.OnceOnly && this.item[this.prop.name] != null)
            };
            if (this.prop._.isRef) {
                if (this.viewType == types_1.ObjectViewType.TreeView)
                    return ce('span', { attrs: { "class": styles + " text-success" } }, main.getPropReferenceValue(this.prop, this.item));
                if (this.prop.isList) {
                    return ce('prop-reference-multiple', {
                        attrs: { styles },
                        on: { changed: this.changed, focus: this.focused },
                        props: pr,
                    });
                }
                else
                    return ce('prop-reference', {
                        attrs: { "class": "prop-reference " + styles },
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
            }
            switch (this.prop._.gtype) {
                case types_1.GlobalType.string:
                    if (this.viewType == types_1.ObjectViewType.TreeView) {
                        let text = main.getPropTextValue(this.prop, this.item) || "";
                        return ce('span', { attrs: { "class": styles + " text-success" } }, text.substring(0, 30) + (text.length > 30 ? "..." : ""));
                    }
                    if (this.viewType != types_1.ObjectViewType.GridView && this.prop.text && this.prop.text.multiLine)
                        return ce('prop-text-multiline', {
                            attrs: {
                                "class": `prop-text-multiline prop-value border`
                            },
                            on: { changed: this.changed, focus: this.focused },
                            props: pr,
                        });
                    else {
                        if (this.viewType == types_1.ObjectViewType.GridView && this.indexInGrid === 0 && typeof this.item._id != "string") {
                            return ce('prop-link', {
                                attrs: { "class": styles },
                                on: { keydown: this.keydown, focus: this.focused },
                                props: pr,
                            });
                        }
                        else
                            return ce('prop-text', {
                                attrs: {
                                    type: (this.prop.text && this.prop.text.password) ? 'password' : 'text',
                                    "class": styles
                                },
                                on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                                props: pr,
                            });
                    }
                case types_1.GlobalType.number:
                    if (this.viewType == types_1.ObjectViewType.TreeView)
                        return ce('span', { attrs: { "class": styles + " text-success" } }, this.item[this.prop.name]);
                    return ce('prop-text', {
                        attrs: { type: 'number', "class": styles },
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
                case types_1.GlobalType.boolean:
                    if (this.viewType == types_1.ObjectViewType.TreeView)
                        return null;
                    if (this.viewType == types_1.ObjectViewType.DetailsView)
                        pr["label"] = this.prop.title;
                    return ce('prop-boolean', {
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
                case types_1.GlobalType.time:
                    if (this.viewType == types_1.ObjectViewType.TreeView)
                        return ce('span', { attrs: { "class": styles + " text-success" } }, this.item[this.prop.name]);
                    return ce('prop-time', {
                        attrs: { "class": "prop-time " + styles },
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
                case types_1.GlobalType.location:
                    return ce('prop-location', {
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
                case types_1.GlobalType.file:
                    pr.styles += " prop-file";
                    return ce('prop-file', {
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
                case types_1.GlobalType.object:
                    return ce('prop-document-editor', {
                        attrs: { "styles": styles },
                        on: { changed: this.changed, keydown: this.keydown, focus: this.focused },
                        props: pr,
                    });
            }
            console.error("prop: Invalid property", this.prop);
            return ce('span', '***');
        }
    };
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "item", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "prop", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "viewType", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "labelMode", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "indexInGrid", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "readonly", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Prop()
    ], Property.prototype, "level", void 0);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit("changed")
    ], Property.prototype, "raiseChanged", null);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit("focus")
    ], Property.prototype, "focused", null);
    tslib_1.__decorate([
        vue_property_decorator_1.Emit('keydown')
    ], Property.prototype, "keydown", null);
    Property = tslib_1.__decorate([
        vue_property_decorator_1.Component({ name: 'Property', components: {} })
    ], Property);
    return Property;
})();
exports.default = Property;
/script>
    < style;
lang = "scss" >
    $left;
left;
$right: right;
prop - {}
    & label;
{
    width: 160;
    px;
}
    & value;
{
    display: inline - block;
    width: 320;
    px;
    padding: 0.25;
    rem;
    0.5;
    rem;
        & -wide;
    {
        width: 500;
        px;
    }
}
    & message;
{
    display: block;
    font - weight;
    500;
}
    & comment.prop - comment - ;
{
    background - color;
    #fef6e0;
    border: 1;
    px;
    solid;
    #FFDE80;
    border - radius;
    6;
    px;
    color: rgba(0, 0, 0, 0.87);
    display: flex;
    font - size;
    12;
    px;
    fa;
    {
        color: #f4b400;
    }
}
{
    prop - label;
    {
        width: auto;
        display: block;
    }
    prop - value;
    {
        display: block;
        width: 100 % ;
        max - width;
        420;
        px;
    }
}
form - check;
{
    prop - comment;
    {
        margin - #;
        {
            $left;
        }
        -1.25;
        rem;
    }
}
/style>;
//# sourceMappingURL=Property.vue.js.map