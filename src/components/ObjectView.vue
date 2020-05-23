<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {
        Elem,
        NewItemMode,
        ObjectDec,
        ObjectDetailsViewType,
        ObjectListsViewType,
        AccessPermission
    } from "../../../sys/src/types";
    import {glob, getNewItemTitle} from '@/main';
    import pluralize = require('pluralize');

    @Component({name: 'ObjectView'})
    export default class ObjectView extends Vue {
        @Prop() private elem: Elem;
        @Prop() private level: number;

        render(ce) {
            let e = this.elem as Elem;
            if (!e.obj) {
                console.error("Element 'object-view' needs obj property.", e);
                ce('div', '...');
                return;
            }

            let data = this.$store.state.data[e.obj._.ref];
            const dec = glob.form.declarations[e.obj._.ref];
            if (!dec) {
                console.log("glob.form.declarations", glob.form.declarations);
                throw `dec is empty for ref '${e.obj._.ref}'`;
            }

            if (Array.isArray(data)) {
                let viewType = (dec as ObjectDec).listsViewType || ObjectListsViewType.Grid;
                let newItem = ((dec as ObjectDec).access & AccessPermission.NewItem) &&
                Array.isArray(data) && (dec as ObjectDec).newItemMode == NewItemMode.newPage ? getNewItemTitle(glob.form.title) : null;
                let props = {uri: e.obj._.ref, dec, newItem, level: this.level};
                switch (viewType) {
                    default:
                    case ObjectListsViewType.Grid:
                        return ce('grid-view', {props});

                    case ObjectListsViewType.Card:
                        return ce('card-view', {props});
                }
            } else {
                let viewType = (dec as ObjectDec).detailsViewType || ObjectDetailsViewType.Tabular;
                if (viewType === ObjectDetailsViewType.Tree)
                    return ce('tree-view', {props: {uri: e.obj._.ref, level: this.level}});
                else
                    return ce('details-view', {props: {uri: e.obj._.ref, dec, level: this.level}});
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
