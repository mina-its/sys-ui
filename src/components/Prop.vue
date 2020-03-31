<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectViewType, Property, GlobalType, EmbeddedInfo} from "../../../sys/types";
    import {PropertyLabelMode} from '@/types';
    import PropBoolean from "@/components/PropBoolean.vue";
    import PropFile from "@/components/PropFile.vue";
    import PropLink from "@/components/PropLink.vue";
    import PropLocation from "@/components/PropLocation.vue";
    import PropMessage from "@/components/PropMessage.vue";
    import PropReference from "@/components/PropReference.vue";
    import PropText from "@/components/PropText.vue";
    import PropTextMultiline from "@/components/PropTextMultiline.vue";
    import PropTime from "@/components/PropTime.vue";
    import {glob} from '@/main';

    const main = require("@/main");

    @Component({
        components: {
            PropTime,
            PropTextMultiline,
            PropText, PropReference, PropMessage, PropLocation, PropLink, PropFile, PropBoolean
        }
    })
    export default class ElemProp extends Vue {
        @Prop() private item: any;
        @Prop() private prop: Property;
        @Prop() private viewType: any;
        @Prop() private labelMode: any;
        @Prop() private indexInGrid: any;

        render(ce) {
            if (!this.prop) {
                console.error("error rendering 'ElemProp' component. prop is empty! item:", this.item);
                return ce('div', '...');
            }

            if (this.prop.condition != null && !main.evalExpression(this.item, this.prop.condition)) {
                this.item[this.prop.name] = null;
                return null;
            }

            switch (this.viewType) {
                case ObjectViewType.GridView:
                    return this.renderValue(ce, "px-1");

                default:
                case ObjectViewType.DetailsView:
                    return this.renderDetailsView(ce);

                case ObjectViewType.TreeView:
                    return this.renderTreeView(ce);
            }
        }

        changed(meta, val) {
            this.$emit('changed', meta, this.item, val);
            main.setPropertyEmbeddedError(this.item, meta.name, null);
        }

        focused(e) {
            this.$emit('focus', e, this.prop);
        }

        keydown(e) {
            this.$emit('keydown', e, this.prop);
        }

        renderDetailsView(ce) {
            let valueClass = `prop-value border mx-2`;
            if (this.prop._.gtype == GlobalType.object && !this.prop.documentView) {
                return ce('object-view', {
                    props: {root: false, elem: {obj: {ref: this.prop._.ref, root: false}}},
                });
            }

            let vl = this.renderValue(ce, valueClass);
            let embed: EmbeddedInfo = this.item._ && this.item._[this.prop.name];
            let msg = null;
            if (embed)
                msg = ce('prop-message', {props: {"message": embed.err}});
            let cmt = this.prop.comment ? ce('div', {attrs: {"class": "prop-comment p-4 mt-3"}}, this.prop.comment) : null;
            let title = this.prop.title || this.prop.name;
            let lbl = (main.someProps(this.prop)) ? null : ce('label', {attrs: {"class": "prop-label align-top"}}, title);

            let styles = "form-group";
            if (this.prop._.gtype == GlobalType.boolean)
                return ce('div', {attrs: {"class": styles + " form-check"}}, [ce('label', {attrs: {"class": "prop-label-boolean"}}, [vl, title]), cmt]);
            else
                return ce('div', {attrs: {"class": styles}}, [lbl, vl, msg, cmt]);
        }

        renderTreeView(ce) {
            let valueClass = "prop-value mx-2";
            let vl = this.renderValue(ce, valueClass);
            let msg = ce('prop-message', {props: {"message": this.item._error}});
            let cmt = this.prop.comment ? ce('small', {attrs: {"class": "property-comment p-3 text-muted d-block"}}, this.prop.comment) : null;
            let title = this.prop.title || this.prop.name;
            let lbl = this.labelMode == PropertyLabelMode.Hidden ? null : (main.someProps(this.prop)) ? null : ce('label', {attrs: {"class": "mr-1 tree-view-attr-label"}}, title + ":");

            let styles = "d-inline-block";
            if (this.prop._.gtype == GlobalType.boolean)
                return ce('div', {attrs: {"class": styles + " form-check"}}, [ce('label', {attrs: {"class": "col-sm-8 tree-view-attr-label"}}, [vl, title]), cmt]);
            else
                return ce('div', {attrs: {"class": styles}}, [lbl, vl, msg, cmt]);
        }

        renderValue(ce, styles: string) {
            let pr = {doc: this.item, name: this.prop.name, prop: this.prop, viewType: this.viewType, styles};

            if (this.prop._.isRef) {
                if (this.viewType == ObjectViewType.TreeView)
                    return ce('span', {attrs: {"class": styles + " text-success"}}, main.getPropReferenceValue(this.prop, this.item));

                if (this.prop.isList)
                    return ce('prop-reference-multiple', {
                        attrs: {styles},
                        on: {changed: this.changed, focus: this.focused},
                        props: pr,
                    });
                else
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

                    if (this.viewType != ObjectViewType.GridView && this.prop.text && this.prop.text.multiLine)
                        return ce('prop-text-multiline', {
                            attrs: {
                                "class": `prop-text-multiline prop-value border`
                            },
                            on: {changed: this.changed, focus: this.focused},
                            props: pr,
                        });
                    else {
                        if (this.viewType == ObjectViewType.GridView && this.indexInGrid === 0 && main.getBsonId(this.item)) {
                            return ce('prop-link', {
                                attrs: {"class": styles},
                                on: {keydown: this.keydown, focus: this.focused},
                                props: pr,
                            });
                        } else
                            return ce('prop-text', {
                                attrs: {
                                    type: (this.prop.text && this.prop.text.password) ? 'password' : 'text',
                                    "class": styles
                                },
                                on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                                props: pr,
                            });
                    }

                case GlobalType.number:
                    if (this.viewType == ObjectViewType.TreeView)
                        return ce('span', {attrs: {"class": styles + " text-success"}}, this.item[this.prop.name]);

                    return ce('prop-text', {
                        attrs: {type: 'number', "class": styles},
                        on: {changed: this.changed, keydown: this.keydown, focus: this.focused},
                        props: pr,
                    });

                case GlobalType.boolean:
                    if (this.viewType == ObjectViewType.TreeView)
                        return null;

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

    .prop- {
        &reference:hover {
            background: url("/images/updown.png") no-repeat $right 5px center;
        }

        &time:hover {
            background: url('/images/calendar.png') no-repeat $right 5px center;
        }

        &location:not(.has-data) {
            opacity: .2;
        }

        &document-editor {
            min-height: 200px;
        }

        &label {
            width: 160px;
        }

        &value {
            display: inline-block;
            width: 320px;
            margin-left: 0.5rem !important;
            padding: 0.25rem 0.5rem !important;

            .prop-file {
                padding: 0 0 !important;
            }

            &-wide {
                width: 500px;
            }
        }

        &file {
            @extend .prop-value-wide;
            overflow: hidden;
            word-break: break-all;
            margin-left: 0 !important;
            box-sizing: content-box;

            &-item:hover {
                background-color: var(--light);
            }

            &-preview {
                position: relative;

                img {
                    max-height: 350px;
                    object-fit: cover;
                    max-width: 100%;
                }

                div {
                    float: left;
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    z-index: 1000;
                    background-color: #92AD40;
                    padding: 0 10px;
                    color: #FFF;
                }
            }
        }

        &message {
            display: block;
            font-weight: 500;
        }

        &comment {
            background-color: #fbfbfb;
            border: 1px solid #F2F2F2;
            color: #4F4F4F;
            font-size: smaller;
        }

        &text-multiline {
            @extend .prop-value-wide;
            min-height: 150px;
            resize: both;
        }
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

        .prop-text-multiline, .prop-value.prop-file {
            width: 100%;
        }
    }

    .form-check {
        .prop-comment {
            margin-#{$left}: -1.25rem;
        }
    }

</style>
