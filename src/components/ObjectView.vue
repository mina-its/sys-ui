<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectDec, ObjectDetailsViewType, ObjectListsViewType, AccessAction} from "../../../sys/src/types";
    import {glob} from '../main';

    @Component({name: 'ObjectView'})
    export default class ObjectView extends Vue {
        @Prop() private uri: string;
        @Prop() private level: number;

        render(ce) {
            if (!this.uri) {
                console.error("Element 'object-view' needs obj property.");
                return ce('div', '...');
            }

            let data = this["$store"].state.data[this.uri];
            const dec = glob.form.declarations[this.uri];
            if (!dec) {
                console.log("glob.form.declarations", glob.form.declarations);
                console.error(`dec is empty for ref '${this.uri}'`);
                return ce("div", '...');
            }

            let props = {uri: this.uri, dec, level: this.level};

            if (Array.isArray(data)) {
                let viewType = (dec as ObjectDec).listsViewType || ObjectListsViewType.Grid;

                switch (viewType) {
                    default:
                    case ObjectListsViewType.Grid:
                        return ce('grid-view', {props});

                    case ObjectListsViewType.Card:
                        return ce('card-view', {props});

                    case ObjectListsViewType.Bars:
                        return ce('bars-view', {props});
                }
            } else {
                let viewType = (dec as ObjectDec).detailsViewType || ObjectDetailsViewType.Tabular;
                if (viewType === ObjectDetailsViewType.Tree)
                    return ce('tree-view', {props});
                else
                    return ce('details-view', {props});
            }
        }
    }
</script>