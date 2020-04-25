<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Elem, LogType, ObjectViewType, ObjectDec, NewItemMode} from "../../../sys/src/types";
    import {glob} from '../main';
    import pluralize = require('pluralize');
    import * as main from '../main';

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
            if (e.obj && e.obj.type == ObjectViewType.TreeView)
                return ce('tree-view', {props: {uri: e.obj.ref}});
            else {
                glob.newItemButton = Array.isArray(data) && (dec as ObjectDec).newItemMode == NewItemMode.newPage ? "New " + pluralize.singular(glob.form.title) : null;
                return Array.isArray(data) ?
                    ce('grid-view', {props: {uri: e.obj.ref, root: rt, dec}}) :
                    ce('details-view', {props: {uri: e.obj.ref, root: rt, dec}});
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
