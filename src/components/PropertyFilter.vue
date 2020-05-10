import {GlobalType} from "../../../sys/src/types";
<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {GlobalType, Keys, ObjectViewType, Property as ObjectProperty} from "../../../sys/src/types";
    import {FilterChangeEventArg, FilterOperator, ItemChangeEventArg, ItemEventArg, MenuItem} from '@/types';
    import {$t, showCmenu} from '@/main';

    @Component({name: 'PropertyFilter', components: {}})
    export default class PropertyFilter extends Vue {
        @Prop() private filter: any;
        @Prop() private filterDoc: any;
        @Prop() private prop: ObjectProperty;
        @Prop() private allowPropChange: boolean;
        private filterOperator: FilterOperator = FilterOperator.Like;

        render(ce) {
            let $this = this;
            let propTitle = ce(this.allowPropChange ? 'a' : 'div', {
                attrs: {"class": "filter-prop-title p-1" + (this.allowPropChange ? '' : ' font-weight-bold'), "href": "javascript:void(0);"},
                on: {click: $this.changeFilterProp}
            }, this.prop.title || this.prop.name);

            let propOper = ce('a', {
                attrs: {"class": "filter-prop-oper mx-1 py-1 px-2 bg-light rounded border text-dark font-weight-bold", "href": "javascript:void(0);"},
                on: {click: $this.filterOperClick}
            }, $t(`opr-${this.filterOperator}`));
            let propValue = this.renderValue(ce, `filter-prop-value px-1 border-0`);
            return ce('div', {attrs: {"class": "d-flex align-self-center"}}, [propTitle, propOper, propValue]);
        }

        mounted() {
            let val = this.filter[this.prop.name];
            if (val == null)
                this.filterOperator = FilterOperator.Like;
            else if (typeof val == "string" || typeof val == "number")
                this.filterOperator = FilterOperator.Equal;
        }

        changed(e: ItemChangeEventArg) {
            if (this.prop._.gtype == GlobalType.string) return;
            this.raiseChanged(e);
        }

        @Emit("changed")
        raiseChanged(e: FilterChangeEventArg): FilterChangeEventArg {
            let filterVal = null;
            if (e.val != null) {
                switch (this.filterOperator) {
                    case FilterOperator.Like:
                        filterVal = {"$reg": "/" + e.val + "/i"};
                        break;

                    case FilterOperator.Equal:
                        filterVal = e.val;
                        break;
                }
            }

            return {prop: e.prop, val: e.val, filterVal};
        }

        keydown(e: ItemEventArg) {
            if (e.event.keyCode == Keys.enter) {
                let val;
                if (this.prop._.gtype == GlobalType.string)
                    val = e.event.target.value.trim();
                else
                    val = this.filterDoc[this.prop.name];
                if (val === "") val = null;
                this.raiseChanged({prop: this.prop, val});
            }
        }

        @Emit('changeFilterProp')
        changeFilterProp(e) {
            return e;
        }

        filterOperClick(e) {
            let oprs = ["nn", "nl"];
            switch (this.prop._.gtype) {
                case GlobalType.string:
                    oprs = [FilterOperator.Like, "eq", "ne", "nn", "nl"];
                    break;

                case GlobalType.number:
                    oprs = ["eq", "ne", "gt", "gte", "lt", "lte", "nn", "nl"];
                    break;

                case GlobalType.time:
                    oprs = ["eq", "ne", "dge", "dle", "gt", "gte", "lt", "lte", "nn", "nl"];
                    break;
            }
            let items: MenuItem[] = oprs.map(opr => {
                return {ref: opr, title: $t(`opr-${opr}`)} as MenuItem;
            });
            showCmenu(this, items, e, (state, item: MenuItem) => {
                if (item) {
                    state.filterOperator = item.ref;
                }
            });
        }

        renderValue(ce, styles: string) {
            let pr = {
                doc: this.filterDoc, name: this.prop.name, prop: this.prop, viewType: ObjectViewType.Filter,
                styles, readOnly: false
            };

            if (this.prop._.isRef)
                return ce('prop-reference', {
                    attrs: {"class": "prop-reference " + styles},
                    on: {changed: this.changed, keydown: this.keydown},
                    props: pr,
                });

            switch (this.prop._.gtype) {
                case GlobalType.string:
                    return ce('prop-text', {
                        attrs: {type: 'text', "class": styles},
                        on: {changed: this.changed, keydown: this.keydown},
                        props: pr,
                    });

                case GlobalType.number:
                    return ce('prop-text', {
                        attrs: {type: 'number', "class": styles},
                        on: {changed: this.changed, keydown: this.keydown},
                        props: pr,
                    });

                case GlobalType.boolean:
                    return ce('prop-boolean', {
                        on: {changed: this.changed, keydown: this.keydown},
                        props: pr,
                    });

                case GlobalType.time:
                    return ce('prop-time', {
                        attrs: {"class": "prop-time " + styles},
                        on: {changed: this.changed, keydown: this.keydown},
                        props: pr,
                    });

                case GlobalType.location:
                    return ce('prop-location', {
                        on: {changed: this.changed, keydown: this.keydown},
                        props: pr,
                    });
            }

            return null;
        }
    }
</script>

<style lang="scss">
    $left: left;
    $right: right;

    .prop- {
        &label {
            width: 160px;
        }

        &value {
            display: inline-block;
            width: 320px;
            padding: 0.25rem 0.5rem;

            &-wide {
                width: 500px;
            }
        }


        &message {
            display: block;
            font-weight: 500;
        }

        &comment.prop-comment-default {
            background-color: #fef6e0;
            border: 1px solid #FFDE80;
            border-radius: 6px;
            color: rgba(0, 0, 0, 0.87);
            display: flex;
            font-size: 12px;

            .fa {
                color: #f4b400;
            }
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
    }

    .filter-prop-oper {
        &:hover {
            background-color: white;
        }
    }

    .form-check {
        .prop-comment {
            margin-#{$left}: -1.25rem;
        }
    }

</style>
