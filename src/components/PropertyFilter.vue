<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import {GlobalType, Keys, ObjectViewType, Property as ObjectProperty} from "../../../sys/src/types";
    import {FilterChangeEventArg, FilterOperator, ItemChangeEventArg, ItemEventArg, MenuItem} from '@/types';
    import {$t, glob, showCmenu} from '@/main';

    @Component({name: 'PropertyFilter', components: {}})
    export default class PropertyFilter extends Vue {
        @Prop() private filter: any;
        @Prop() private filterDoc: any;
        @Prop() private prop: ObjectProperty;
        @Prop() private allowPropChange: boolean;
        private filterOperator: FilterOperator = null;

        render(ce) {
            let $this = this;
            let propTitle = ce(this.allowPropChange ? 'a' : 'div', {
                attrs: {"class": "filter-prop-title" + (this.allowPropChange ? '' : ' font-weight-bold'), "href": "javascript:void(0);"},
                on: {click: $this.changeFilterProp}
            }, this.prop.title || this.prop.name);

            let propOper = ce('a', {
                attrs: {"class": "filter-prop-oper py-1 px-2 font-weight-bold", "href": "javascript:void(0);"},
                on: {click: $this.changeOperator}
            }, $t(`opr-${this.filterOperator}`));
            let propValue = this.renderValue(ce, `filter-prop-value d-flex align-items-center px-1 border-0`);
            return ce('div', {attrs: {"class": "d-flex align-items-center"}}, [propTitle, propOper, propValue]);
        }

        @Watch('prop')
        onPropChanged(val: string, oldVal: string) {
            this.filterOperator = this.catchOperator();
        }

        mounted() {
            this.filterOperator = this.catchOperator();
        }


        changed(e: ItemChangeEventArg) {
            if (!this.prop._.isRef && (this.prop._.gtype == GlobalType.string || this.prop._.gtype == GlobalType.number)) return;
            this.raiseChanged(e);
        }

        @Emit("changed")
        raiseChanged(e: FilterChangeEventArg): FilterChangeEventArg {
            let filterVal = e.filterVal;
            if (e.val != null) {
                switch (this.filterOperator) {
                    case FilterOperator.Like:
                        filterVal = {"$RegExp": "/" + e.val + "/i"};
                        break;

                    case FilterOperator.StartWith:
                        filterVal = {"$RegExp": "/^" + e.val + "/i"};
                        break;

                    case FilterOperator.EndWith:
                        filterVal = {"$RegExp": "/" + e.val + "$/i"};
                        break;

                    case FilterOperator.Yes:
                        filterVal = true;
                        break;

                    case FilterOperator.No:
                        filterVal = {"$ne": true};
                        break;

                    case FilterOperator.NotEqual:
                        filterVal = {"$ne": e.val};
                        break;

                    case FilterOperator.GreaterThan:
                        filterVal = {"$gt": e.val};
                        break;

                    case FilterOperator.GreaterThanEqual:
                        filterVal = {"$gte": e.val};
                        break;

                    case FilterOperator.LessThan:
                        filterVal = {"$lt": e.val};
                        break;

                    case FilterOperator.LessThanEqual:
                        filterVal = {"$lte": e.val};
                        break;

                    case FilterOperator.In:
                        filterVal = {"$in": e.val};
                        break;

                    case FilterOperator.NotIn:
                        filterVal = {"$nin": e.val};
                        break;

                    case FilterOperator.Exist:
                        if (this.prop._.gtype == GlobalType.string)
                            filterVal = {"$RegExp": "/\\w/"};
                        else
                            filterVal = {"$exists": true};
                        break;

                    case FilterOperator.None:
                        if (this.prop._.gtype == GlobalType.string)
                            filterVal = {$not: {$RegExp: "/\\w/"}};
                        else
                            filterVal = {$null: true};
                        break;

                    case FilterOperator.Equal:
                        filterVal = e.val;
                        break;
                }
            }

            return {prop: e.prop, val: e.val, filterVal};
        }

        keydown(e: ItemEventArg) {
            console.log(1);
            if (e.event.keyCode == Keys.enter) {
                let val;
                if (this.prop._.gtype == GlobalType.string)
                    val = e.event.target.value.trim();
                else if (this.prop._.gtype == GlobalType.number)
                    val = e.event.target.valueAsNumber != NaN ? parseInt(e.event.target.value) : e.event.target.valueAsNumber;
                else
                    val = this.filterDoc[this.prop.name];
                if (val === "") val = null;
                this.raiseChanged({prop: this.prop, val});
            }
        }

        get propFilter() {
            let filter = this.filter.$and.find(i => this.prop.name == Object.keys(i.$or[0])[0]);
            if (!filter || !filter.$or) return null;
            return filter.$or[0][this.prop.name];
        }

        @Emit('changeFilterProp')
        changeFilterProp(e) {
            return e;
        }

        catchOperator(): FilterOperator {
            let val = this.filterDoc[this.prop.name];
            let filterVal = this.propFilter;
            if (filterVal) {
                if (filterVal instanceof RegExp) {
                    if (/^\/\^/.test(filterVal.toString())) return FilterOperator.StartWith;
                    else if (/\$\/i?$/.test(filterVal.toString())) return FilterOperator.EndWith;
                    else if (/\/\\w\//.test(filterVal.toString())) return FilterOperator.Exist;
                    else return FilterOperator.Like;
                } else if (filterVal.$not && filterVal.$not.$RegExp) {
                    if (/\/\\w\//.test(filterVal.$not.$RegExp)) return FilterOperator.None;
                } else if (filterVal.$gt) return FilterOperator.GreaterThan;
                else if (filterVal.$gte) return FilterOperator.GreaterThanEqual;
                else if (filterVal.$lt) return FilterOperator.LessThan;
                else if (filterVal.$lte) return FilterOperator.LessThanEqual;
                else if (filterVal.$in) return FilterOperator.In;
                else if (filterVal.$ne === true) return FilterOperator.No;
                else if (filterVal.$ne) return FilterOperator.NotEqual;
                else if (filterVal.$nn) return FilterOperator.NotNull;
                else if (filterVal.$null) return FilterOperator.None;
                else if (filterVal.$exists) return FilterOperator.Exist;
                else if (filterVal.$nin) return FilterOperator.NotIn;
                else if (typeof filterVal == "string") return FilterOperator.Equal;
                else if (filterVal === true) return FilterOperator.Yes;
                else return FilterOperator.Equal;
            } else {
                if (this.prop._.isRef) return FilterOperator.Equal;
                else {
                    switch (this.prop._.gtype) {
                        case GlobalType.boolean:
                            return val === true ? FilterOperator.Yes : (val === false ? FilterOperator.No : FilterOperator.Select);
                        case GlobalType.string:
                            return FilterOperator.Like;
                    }
                }
                return FilterOperator.Equal;
            }
        }

        changeOperator(e) {
            let oprs;
            if (this.prop._.isRef) {
                oprs = [FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.None, FilterOperator.Exist];
            } else {
                switch (this.prop._.gtype) {
                    case GlobalType.string:
                        oprs = [FilterOperator.Like, FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.StartWith, FilterOperator.EndWith, FilterOperator.None, FilterOperator.Exist];
                        break;

                    case GlobalType.number:
                        oprs = [FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.GreaterThan, FilterOperator.GreaterThanEqual, FilterOperator.LessThan, FilterOperator.LessThanEqual, FilterOperator.None, FilterOperator.Exist];
                        break;

                    case GlobalType.time:
                        oprs = [FilterOperator.Equal, FilterOperator.NotEqual, FilterOperator.Null, FilterOperator.NotNull, FilterOperator.GreaterThan, FilterOperator.GreaterThanEqual, FilterOperator.LessThan, FilterOperator.LessThanEqual, FilterOperator.None, FilterOperator.Exist];
                        break;

                    case GlobalType.boolean:
                        oprs = [FilterOperator.Select, FilterOperator.Yes, FilterOperator.No];
                        break;

                    default:
                        oprs = [FilterOperator.None, FilterOperator.Exist];
                        break;
                }
            }
            let items: MenuItem[] = oprs.map(opr => {
                return {ref: opr, title: $t(`opr-${opr}`)} as MenuItem;
            });
            showCmenu(this, items, e, (state, item: MenuItem) => {
                if (item) {
                    state.filterOperator = item.ref;
                    let val = this.filterDoc[this.prop.name];
                    switch (state.filterOperator) {
                        case FilterOperator.No:
                        case FilterOperator.Exist:
                        case FilterOperator.None:
                        case FilterOperator.Yes:
                            val = "";
                            break;

                        default:
                            val = val || null; // if just switch from not parametric props must be empty
                            break;
                    }
                    this.raiseChanged({prop: this.prop, val});
                }
            });
        }

        renderValue(ce, styles: string) {
            if (this.filterOperator == FilterOperator.None || this.filterOperator == FilterOperator.Exist ||
                this.filterOperator == FilterOperator.Null || this.filterOperator == FilterOperator.NotNull || this.filterDoc == null) return null;

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

    .filter-prop-title {
        padding: .375rem .25rem !important;
    }

    .filter-prop-oper {
        background-color: #ddd;
        color: #666;

        &:hover {

        }
    }

    input.filter-prop-value {
        width: 6rem;
        outline: none;
    }

</style>
