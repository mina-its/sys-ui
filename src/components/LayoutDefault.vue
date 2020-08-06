<template>
    <!--    <div class="layout layout-default">-->
    <!--  Toolbar -->
    <div v-if="!hideToolbar" :class="{'d-flex p-2 align-items-center btn-toolbar toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

        <!--  Breadcrumb -->
        <Breadcrumb :breadcrumb="glob.form.breadcrumb" :title="glob.form.breadcrumbLast"/>

        <!--  Toolbar Apply/Cancel -->
        <ToolbarModifyButtons/>

        <!--  Head Functions -->
        <div class="mr-auto"></div>

        <!--  Inline message box -->
        <div class="inline-message-box small px-2 hide"></div>

        <!--  Global functions -->
        <template v-for="func in globalFunctions">
            <a :href="func.ref" :class="`${func.style||'btn btn-success mx-1 px-2'}`" v-if="func.ref">{{func.title}}</a>
            <Function v-else styles="btn-primary mx-1" :name="func.name" @exec="func.exec" :title="func.title"/>
        </template>

        <!--  Refresh -->
        <button class="btn btn-link text-secondary px-2" @click="refresh"><i class="fas fa-sync"></i></button>

        <!--  Object Menu -->
        <button class="btn btn-link text-secondary px-2" @click="clickConfigMenu"><i class="fal fa-cog fa-lg"></i></button>

        <!-- Info Panel -->
        <button title="Show info panel" v-if="!glob.infoPanel.show" @click="glob.infoPanel.show=true" class="btn close-panel btn-link px-2"><i class="fal fa-info-circle fa-lg"></i></button>
    </div>
    <!--    </div>-->
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {HeadFunc, MenuItem} from "../types";
    import {$t, showCmenu} from "../main";

    @Component({name: "LayoutDefault"})
    export default class LayoutDefault extends Vue {
        @Prop() private hideToolbar: boolean;
        @Prop() private globalFunctions: HeadFunc[];
        @Prop() private configMenu: MenuItem[];

        @Emit('selectConfigMenuItem')
        selectConfigMenuItem(ref: string) {
            return ref;
        }

        clickConfigMenu(e) {
            let menu = this.configMenu || [{ref: "default-print", title: $t('print')}];
            showCmenu(null, menu, e, (state, item: MenuItem) => {
                switch (item.ref) {
                    case "default-print":
                        window.print();
                        break;

                    default:
                        this.selectConfigMenuItem(item.ref);
                        break;
                }
            });
        }

        refresh() {
            main.load(location.pathname, false);
        }
    }
</script>

<style lang="scss">

</style>