<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {GlobalType, ObjectViewType, Property as ObjectProperty, PropertyEditMode, TextEditor} from "../../../sys/src/types";
    import {ChangeType, Constants, ItemChangeEventArg, ItemEventArg, PropertyLabelMode, PropEventArg} from '../types';
    import * as main from '../main';
    import {getPropertyEmbedError, getPropTextValue} from '../main';

    @Component({name: 'Property', components: {}})
    export default class Property extends Vue {
        @Prop() private item: any;
        @Prop() private prop: ObjectProperty;
        @Prop() private viewType: ObjectViewType;
        @Prop() private labelMode: PropertyLabelMode;
        @Prop() private indexInGrid: any;
        @Prop() private readonly: boolean;
        @Prop() private level: number;

        render(ce) {
            if (!this.prop) {
                console.error("error rendering 'Property' component. prop is empty! item:", this.item);
                return ce('div', '...');
            }
            this.prop._ = this.prop._ || {gtype: GlobalType.string};

            if (this.prop.condition && !main.evalExpression(this.item, this.prop.condition))
                return null;

            switch (this.viewType) {
                case ObjectViewType.GridView:
                    return this.renderValue(ce, "px-2 py-1");

                default:
                case ObjectViewType.DetailsView:
                    return this.renderDetailsView(ce);

                case ObjectViewType.TreeView:
                    return this.renderTreeView(ce);
            }
        }

        changed(e: ItemChangeEventArg) {
            if (!this.readonly)
                this.raiseChanged(e);
        }

        @Emit("changed")
        raiseChanged(e: ItemChangeEventArg): ItemChangeEventArg {
            main.setPropertyEmbeddedError(this.item, e.prop.name, null);
            e.item = this.item;
            e.type = ChangeType.EditProp;
            return e;
        }

        @Emit("focus")
        focused(e): PropEventArg {
            return e;
        }

        @Emit('keydown')
        keydown(e: ItemEventArg) {
            return e;
        }

        renderDetailsView(ce) {
            let valueClass = `prop-value border`;
            if (this.prop._.gtype == GlobalType.object && !this.prop.documentView)
                return ce('object-view', {props: {level: this.level, uri: this.prop._.ref}});

            let vl = this.renderValue(ce, valueClass);
            let embedErr = getPropertyEmbedError(this.item, this.prop.name);
            let msg = null;
            if (embedErr) msg = ce('prop-message', {props: {message: embedErr}});

            let title = this.prop.title || this.prop.name;
            let labelNoWrap = (this.prop.text && this.prop.text.editor);
            let label = (main.someProps(this.prop)) ? null : ce('label', {attrs: {"class": "prop-label align-top pt-2" + (labelNoWrap ? " text-nowrap" : "")}}, title);
            let children = [label, vl, msg];

            // Property comment
            if (this.prop.comment) {
                let style = "prop-comment " + (this.prop.commentStyle || "");
                let comment = `<i class="fa"></i><div>${main.markDown(this.prop.comment)}</div>`;
                let cmt = ce('div', {attrs: {"class": style}, domProps: {'innerHTML': comment}});
                if (this.prop.commentStyle && /\bbefore\b/.test(this.prop.commentStyle)) // Comment before
                    children.unshift(cmt);
                else
                    children.push(cmt);
            }

            return ce('div', {attrs: {"class": "form-group p_" + this.prop.name}}, children);
        }

        renderTreeView(ce) {
            let valueClass = "prop-value mx-2";
            let vl = this.renderValue(ce, valueClass);
            let msg = ce('prop-message', {props: {"message": this.item._error}});
            let cmt = this.prop.comment ? ce('small', {attrs: {"class": "property-comment p-3 text-muted d-block"}}, this.prop.comment) : null;
            let title = this.prop.title || this.prop.name;
            let label = this.labelMode == PropertyLabelMode.Hidden ? null : (main.someProps(this.prop)) ? null : ce('label', {attrs: {"class": "mr-1 tree-view-attr-label"}}, title + ":");

            let styles = "d-inline-block";
            if (this.prop._.gtype == GlobalType.boolean)
                return ce('div', {attrs: {"class": styles + " form-check"}}, [ce('label', {attrs: {"class": "col-sm-8 tree-view-attr-label"}}, [vl, title]), cmt]);
            else
                return ce('div', {attrs: {"class": styles}}, [label, vl, msg, cmt]);
        }

        renderValue(ce, styles: string) {
            let pr = {
                doc: this.item, name: this.prop.name, prop: this.prop, viewType: this.viewType,
                styles,
                readOnly: this.readonly || this.prop.editMode == PropertyEditMode.Readonly || (this.prop.editMode == PropertyEditMode.OnceOnly && this.item[this.prop.name] != null && !this.item._new)
            };

            if (this.prop._.isRef) {
                if (this.viewType == ObjectViewType.TreeView)
                    return ce('span', {attrs: {"class": styles + " text-success"}}, main.getPropReferenceValue(this.prop, this.item));

                if (this.prop.isList) {
                    return ce('prop-reference-multiple', {
                        attrs: {styles},
                        on: {changed: this.changed, focus: this.focused},
                        props: pr,
                    });
                } else
                    return ce('prop-reference', {
                        attrs: {"class": "prop-reference " + styles},
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });
            }

            switch (this.prop._.gtype) {
                case GlobalType.string:
                    if (this.viewType == ObjectViewType.TreeView) {
                        let text = main.getPropTextValue(this.prop, this.item) || "";
                        return ce('span', {attrs: {"class": styles + " text-success"}}, text.substring(0, 30) + (text.length > 30 ? "..." : ""));
                    }

                    if (this.viewType != ObjectViewType.GridView && this.prop.text && this.prop.text.editor == TextEditor.Html)
                        return ce('prop-html-editor', {
                            on: {changed: this.changed, focus: this.focused},
                            props: pr,
                        });
                    else if (this.viewType != ObjectViewType.GridView && this.prop.text && this.prop.text.editor)
                        return ce('prop-text-editor', {
                            on: {changed: this.changed, focus: this.focused},
                            props: pr,
                        });
                    else if (this.viewType != ObjectViewType.GridView && this.prop.text && this.prop.text.multiLine)
                        return ce('prop-text-multiline', {
                            attrs: {
                                "class": `prop-text-multiline prop-value border`
                            },
                            on: {changed: this.changed, focus: this.focused},
                            props: pr,
                        });
                    else if (this.prop.isList)
                        return ce('prop-text-multiple', {
                            on: {changed: this.changed, focus: this.focused, keydown: this.keydown},
                            props: pr,
                        });
                    else {
                        if (this.viewType == ObjectViewType.GridView && this.indexInGrid === 0 && !getPropTextValue(this.prop, this.item))
                            this.item._.emptyFirstColumn = true;

                        if (this.viewType == ObjectViewType.GridView && this.indexInGrid === 0 && !this.item._new && !this.item._.emptyFirstColumn) { // we need _new to allow first column to edit
                            return ce('prop-link', {
                                attrs: {"class": styles},
                                on: {keydown: this.keydown, focus: this.focused},
                                props: pr,
                            });
                        } else {
                            if (pr.readOnly && !(this.prop.text && this.prop.text.password) && this.item[this.prop.name])
                                return ce('div', {
                                    attrs: {"class": styles}
                                }, this.item[this.prop.name]);
                            else
                                return ce('prop-text', {
                                    attrs: {
                                        type: (this.prop.text && this.prop.text.password) ? 'password' : 'text',
                                        "class": styles
                                    },
                                    on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                                    props: pr,
                                });
                        }
                    }

                case GlobalType.number:
                    if (this.viewType == ObjectViewType.TreeView)
                        return ce('span', {attrs: {"class": styles + " text-success"}}, this.item[this.prop.name]);

                    return ce('prop-number', {
                        attrs: {"class": styles},
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });

                case GlobalType.boolean:
                    if (this.viewType == ObjectViewType.TreeView)
                        return null;

                    if (this.viewType == ObjectViewType.DetailsView)
                        return ce('prop-boolean-switch', {
                            on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                            props: pr,
                        });
                    else
                        return ce('prop-boolean', {
                            on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                            props: pr,
                        });

                case GlobalType.time:
                    if (this.viewType == ObjectViewType.TreeView)
                        return ce('span', {attrs: {"class": styles + " text-success"}}, this.item[this.prop.name]);

                    return ce('prop-time', {
                        attrs: {"class": "prop-time " + styles},
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });

                case GlobalType.location:
                    return ce('prop-location', {
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });

                case GlobalType.file:
                    pr.styles += " prop-file";
                    return ce('prop-file', {
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });

                case GlobalType.object:
                    return ce('prop-document-editor', {
                        attrs: {"styles": styles},
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });
            }

            console.error("prop: Invalid property", this.prop);
            return ce('span', '***');
        }
    }
</script>

<style lang="scss">
    $left: left;
    $right: right;

    .prop-label {
        width: 10rem;
    }

    .prop-value {
        display: inline-block;
        width: 20rem;
        max-width: 100%;
        padding: 0.25rem 0.5rem;

        &-wide {
            width: 30rem;
        }

        .prop-error {
            color: red;
        }
    }

    .prop-message {
        display: block;
        font-weight: 500;
    }

    .prop-comment {
        color: rgba(0, 0, 0, 0.87);
        font-size: 12px;

        ul {
            padding-left: 0;
        }

        &.tip {
            background-color: #fef6e0;
            border: 1px solid #FFDE80;
            border-radius: 6px;
            display: flex;
            padding: 1rem;
            margin: .5rem 0;

            i.fa {
                color: #f4b400;
                font-size: 1.4em;
                margin-right: .8rem;

                &:before {
                    content: "\f05a";
                }
            }
        }

        &.note {
            border: 1px solid rgba(0, 115, 187, .35);
            background-color: rgba(241, 250, 255, .8);
            border-radius: 6px;
            display: flex;
            padding: 1rem;
            margin: .5rem 0;

            i.fa {
                color: rgba(0, 115, 187, 1);
                font-size: 1.4em;
                margin-right: .8rem;

                &:before {
                    content: "\f05a";
                }
            }
        }

        &.warn {
            background-color: #f9e4e4;
            border: 1px solid #e8b6b6;
            border-radius: 6px;
            display: flex;
            padding: 1rem;
            margin: .5rem 0;

            i.fa {
                color: #ea8989;
                font-size: 1.4em;
                margin-right: .8rem;

                &:before {
                    content: "\f071";
                }
            }
        }
    }

    .compress-view .prop-value {
        width: 100%;
    }

    @media (max-width: 576px) {
        .prop-label {
            width: auto;
            display: block;
        }

        .prop-value {
            display: block;
            width: 100%;
            max-width: 420px;
        }
    }

    .form-check {
        .prop-comment {
            margin-#{$left}: -1.25rem;
        }
    }

</style>
