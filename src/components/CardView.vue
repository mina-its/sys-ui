<template>
    <div :class="{'card-view w-100':true,'p-2':root}">
        <div class="d-flex flex-wrap">
            <div class="" v-for="item in items">
                <div class="card m-2" style="width: 540px;" tabindex="0">
                    <div @click="clickMenu($event, item)" class="card-header">
                        <span>{{getTitle(item)}}</span>
                        <i class="fa fa-cog fa-lg text-muted float-right mt-1"></i>
                    </div>
                    <div class="card-body details-view">
                        <Property v-for="prop in dec.properties" :key="prop.name" :item="item" :prop="prop"
                                  @changed="changed" :viewType="2"></Property>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {ItemChangeEventArg, StateChange, ChangeType, JQuery, MenuItem} from '@/types';
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ObjectDec, IData, LogType} from "../../../sys/src/types";
    import {$t, showCmenu} from '@/main';
    import * as main from '../main';

    @Component({name: 'CardView', components: {}})
    export default class CardView extends Vue {
        @Prop() private uri: string;
        @Prop() private root: boolean;
        @Prop() private dec: ObjectDec;

        get items(): IData[] {
            let _items = this.$store.state.data[this.uri] || [];
            if (this.dec.reorderable)
                main.sort(_items, "_z");
            return _items;
        }

        clickMenu(e, item) {
            let items: MenuItem[] = [
                {ref: 'details', title: $t('details')},
                {ref: null, title: '-'},
                {ref: 'delete', title: $t('delete')},
            ];

            if (this.dec.reorderable) {
                items.push({ref: null, title: '-'});
                items.push({ref: 'move-up', title: $t('row-move-up')});
                items.push({ref: 'move-down', title: $t('row-move-down')});
            }

            showCmenu(item, items, e, (state, item: MenuItem) => {
                if (!item) return;
                switch (item.ref) {
                    case 'delete':
                        main.dispatchStoreModify(this, {
                            type: ChangeType.DeleteItem,
                            uri: this.dec.ref,
                            item: state,
                            vue: this
                        } as StateChange);
                        break;

                    case 'details': {
                        if (!state._id) {
                            main.notify('ID is expected, please check the item data!', LogType.Error);
                            console.error(state);
                            return;
                        }
                        let href = main.prepareServerUrl(`${this.dec.ref}/${main.getBsonId(state)}`);
                        main.load(href, true);
                        break;
                    }

                    case 'move-up':
                        main.commitReorderItems(this.$store, this.items, true, this.uri, state);
                        break;

                    case 'move-down':
                        main.commitReorderItems(this.$store, this.items, false, this.uri, state);
                        break;

                }
            });
        }

        getTitle(item: any) {
            return $t(item["title"]);
        }

        changed(e: ItemChangeEventArg) {
            main.dispatchStoreModify(this, {
                type: ChangeType.EditProp,
                prop: e.prop,
                value: e.val,
                item: e.item,
                uri: this.uri + "/" + main.getBsonId(e.item),
                vue: e.vue
            } as StateChange);
        }
    }
</script>

<style scoped lang="scss">
    .card-view figure {
        text-align: right;
    }

    .card-view .card {
        outline: none;
    }
</style>
