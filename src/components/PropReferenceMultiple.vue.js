"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
;
"focus";
tabindex = "1";
ref = "ctrl";
class {
}
"styles + ' prop-reference ref-multi pr-3'" >
    v - ;
for ( = "item in items"; class {
} = "ref-multi-item rounded-lg rmI d-inline-block mr-1 my-1 px-1 border text-nowrap" >
; )
"remove(item)";
class {
}
"text-black-50 mr-1 rmD fa fa-times";
style = "cursor:pointer" > /i>
    < span;
class {
}
"rmV" > {};
{
    item.title;
}
/span>
    < /div>
    < textarea;
"showDropDown(prop._.items)";
"refreshText";
"update()";
v - ;
if ( = "!readOnly")
    class {
    }
"w-100 bg-transparent align-middle rmT d-inline border-0";
rows = "1";
spellcheck = "false";
autocomplete = "off";
autocorrect = "off";
autocapitalize = "off";
tabindex = "1" > /textarea>
    < div;
v - ;
class {
}
"pt-2 pb-3" >  & nbsp;
/div>
    < /div>
    < /template>
    < script;
lang = "ts" >
;
const vue_property_decorator_1 = require("vue-property-decorator");
const main = tslib_1.__importStar(require("../main"));
let PropReferenceMultiple = class PropReferenceMultiple extends vue_property_decorator_1.Vue {
    update() {
        let val = event.target.value;
        let items = val == "" ? this.prop._.items : this.prop._.items.filter(item => item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
        items.forEach(item => item.hover = false);
        this.showDropDown(items);
    }
    refreshText() {
        let val = this.doc[this.prop.name];
        this.doc[this.prop.name] = null;
        this.doc[this.prop.name] = val;
    }
    focus() {
        $(this.$refs.ctrl).find("textarea").focus();
    }
    remove(item) {
        let val = this.doc[this.prop.name];
        val = val.filter(v => !main.equalID(v, item.ref));
        return { prop: this.prop, val, vue: this };
    }
    showDropDown(items) {
        let valueStrKeys = this.value.map(v => JSON.stringify(v));
        items = items.filter(item => !valueStrKeys.includes(JSON.stringify(item.ref)));
        main.showCmenu(this.prop, items, { ctrl: this.$refs.ctrl }, (state, item) => this.selectItem(item));
    }
    selectItem(item) {
        if (!item) { // Esc
            this.refreshText();
            return;
        }
        let val = this.doc[this.prop.name];
        if (!val)
            val = [];
        val = [...val];
        val.push(item.ref);
        return { prop: this.prop, val, vue: this };
    }
    get value() {
        let val = this.doc[this.prop.name];
        if (!val)
            this.doc[this.prop.name] = val = [];
        else if (!Array.isArray(val))
            val = [val];
        return val;
    }
    get items() {
        let items = [];
        for (const v of this.value) {
            let item = this.prop._.items.find(i => main.equalID(v, i.ref));
            if (item)
                items.push(item);
            else
                items.push({ title: "...", ref: v });
        }
        return items;
    }
};
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropReferenceMultiple.prototype, "type", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropReferenceMultiple.prototype, "doc", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropReferenceMultiple.prototype, "prop", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropReferenceMultiple.prototype, "styles", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Prop()
], PropReferenceMultiple.prototype, "readOnly", void 0);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropReferenceMultiple.prototype, "remove", null);
tslib_1.__decorate([
    vue_property_decorator_1.Emit('changed')
], PropReferenceMultiple.prototype, "selectItem", null);
PropReferenceMultiple = tslib_1.__decorate([
    vue_property_decorator_1.Component({ name: 'PropReferenceMultiple' })
], PropReferenceMultiple);
exports.default = PropReferenceMultiple;
/script>
    < style;
lang = "scss" >
        .prop - reference.ref - multi;
{
    outline: none;
    padding: 0;
    0.25;
    rem;
    important;
    textarea;
    {
        width: 40;
        px;
        important;
        outline: none;
        resize: none;
        overflow: hidden;
    }
    ref - multi - item;
    {
        background - color;
        whitesmoke;
    }
    rmV;
    {
        font - size;
        smaller;
        color: #;
        666;
    }
}
/*.prop-reference.ref-multi textarea {*/
/*    display: none !important;*/
/*}*/
/*.prop-reference.ref-multi:focus textarea, .prop-reference.ref-multi:focus-within textarea {*/
/*    display: inline-block !important;*/
/*}*/
/style>;
//# sourceMappingURL=PropReferenceMultiple.vue.js.map