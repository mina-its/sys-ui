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
    import {glob} from '@/main';
    import pluralize = require('pluralize');

    @Component({name: 'ObjectView'})
    export default class ObjectView extends Vue {
        @Prop() private elem: Elem;
        @Prop() private root: boolean;

        render(ce) {
            let e = this.elem as Elem;
            if (!e.obj) {
                console.error("Element 'object-view' needs obj property.", e);
                ce('div', '...');
                return;
            }

            let data = this.$store.state.data[e.obj._.ref];
            const dec = glob.form.declarations[e.obj._.ref];
            if (!dec) throw `dec is empty for ref '${e.obj._.ref}'`;
            let rt = this.root == null ? true : this.root;
            glob.newItemButton = ((dec as ObjectDec).access & AccessPermission.NewItem) &&
            Array.isArray(data) && (dec as ObjectDec).newItemMode == NewItemMode.newPage ? "New " + pluralize.singular(glob.form.title) : null;

            if (Array.isArray(data)) {
                let viewType = (dec as ObjectDec).listsViewType || ObjectListsViewType.Grid;
                switch (viewType) {
                    default:
                    case ObjectListsViewType.Grid:
                        return ce('grid-view', {props: {uri: e.obj._.ref, root: rt, dec}});

                    case ObjectListsViewType.Card:
                        return ce('card-view', {props: {uri: e.obj._.ref, root: rt, dec}});
                }
            } else {
                let viewType = (dec as ObjectDec).detailsViewType || ObjectDetailsViewType.Tabular;
                if (viewType === ObjectDetailsViewType.Tree)
                    return ce('tree-view', {props: {uri: e.obj._.ref}});
                else
                    return ce('details-view', {props: {uri: e.obj._.ref, root: rt, dec}});
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
