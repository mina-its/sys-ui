import {ObjectDetailsViewType} from "../../../sys/src/types";
import {ObjectListsViewType} from "../../../sys/src/types";
<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {
        Elem,
        NewItemMode,
        ObjectDec,
        ObjectListsViewType,
        ObjectViewType,
        ObjectDetailsViewType
    } from "../../../sys/src/types";
    import {glob} from '../main';
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

            let data = this.$store.state.data[e.obj.ref];
            // if (!data) data = this.$store.state.data[e.obj.ref] = {};
            const dec = glob.form.declarations[e.obj.ref];
            if (!dec) throw `dec is empty for ref '${e.obj.ref}'`;
            glob.form.toolbar = true;
            let rt = this.root == null ? true : this.root;
            glob.newItemButton = Array.isArray(data) && (dec as ObjectDec).newItemMode == NewItemMode.newPage ? "New " + pluralize.singular(glob.form.title) : null;

            if (Array.isArray(data)) {
                let viewType = (dec as ObjectDec).listsViewType || ObjectListsViewType.Grid;
                switch (viewType) {
                    default:
                    case ObjectListsViewType.Grid:
                        ce('grid-view', {props: {uri: e.obj.ref, root: rt, dec}});
                        break;

                    case ObjectListsViewType.Card:
                        ce('card-view', {props: {uri: e.obj.ref, root: rt, dec}});
                        break;
                }
            } else {
                let viewType = (dec as ObjectDec).detailsViewType || ObjectDetailsViewType.Tabular;
                switch (viewType) {
                    default:
                        ce('details-view', {props: {uri: e.obj.ref, root: rt, dec}});
                        break;

                    case ObjectDetailsViewType.Tree:
                        return ce('tree-view', {props: {uri: e.obj.ref}});
                }
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
