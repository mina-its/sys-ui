<template>
    <div class="flowchart-designer w-100 h-100 d-flex flex-column">
        <!-- Toolbar -->
        <div :class="{'d-flex px-4 btn-toolbar p-2 align-items-center separator-line toolbar':1, 'pl-4':ltr, 'pr-4':rtl}" role="toolbar" aria-label="Toolbar with button groups">

            <Breadcrumb :breadcrumb="glob.form.breadcrumb" :title="flowchart.title"/>

            <!-- Apply / Cancel -->
            <div v-if="dirty" class="mx-2" role="group">
                <button class="btn btn-primary mx-2 px-4" @click="apply"><i class="fal fa-check-circle"></i> {{$t('apply')}}</button>
                <button class="btn btn-outline-secondary" @click="refresh" name="cancel">{{$t('cancel')}}</button>
            </div>

            <div class="mr-auto"></div>

            <!--  Refresh -->
            <button class="btn btn-link text-secondary px-2" @click="refresh"><i class="fas fa-sync"></i></button>

            <!-- Object Menu -->
            <button class="btn btn-link text-secondary px-2" @click="clickObjectMenu"><i class="fal fa-cog fa-lg"></i></button>

            <!-- Info Panel -->
            <button title="Show info panel" v-if="!showRightPanel" @click="showRightPanel=true" class="btn close-panel btn-link px-2"><i class="fal fa-info-circle fa-lg"></i></button>
        </div>

        <!-- Content -->
        <div class="d-flex w-100 flowchart-content overflow-auto" style="flex: auto;">
            <aside class="overflow-hidden border-right separator-line bg-white d-none d-md-block py-3">
                <ul class="nav flex-column">
                    <li v-for="node in dec.nodes" class="nav-item px-3">
                        <button draggable="true" @dragstart="dragNodeDec($event,node)" class="text-nowrap px-0 rounded-0 bg-secondary w-100 text-left my-1 nav-link btn btn-link text-white" :href="node.ref">
                            <i :class="'text-center px-3 fa-lg fal fa-' + node.icon" style="width: 3rem"></i>
                            <span class="small font-weight-bold">{{node.title}}</span>
                        </button>
                    </li>
                </ul>
            </aside>

            <!-- Main -->
            <div class="w-100 h-100 overflow-auto d-flex" @dragover="dragOver" @drop="dropNode">
                <div class="p-4 bg-white main-canvas position-relative" style="width: 1000px;height: 10000px">
                    <svg ref="svg" viewBox="0 0 10000 10000" width="10000" height="10000" class="position-absolute">
                        <g v-for="link of links">
                            <path fill="none" :d="link.path" stroke="#fff3" stroke-width="20" @click="selectLink(link)"/>
                            <path fill="none" :d="link.path" stroke="black" :stroke-width="link.active?3:1" @click="selectLink(link)"/>
                        </g>
                    </svg>
                    <div @focus="selectNode(node)" :tabindex="node.tag" @mousedown="startMoveNode($event,node)" :class="'cursor-pointer position-absolute node bg-light py-2 px-3 rounded ' + (node._.dec.nodeStyle || '') + (isSelected(node)?' active':'')" v-for="node of flowchart.nodes"
                         :style="{top: node.point.y+'px', left: node.point.x+'px','background-color':node._.dec.nodeColor+'!important'}">
                        <i :class="'text-center fa-lg fal fa-' + node._.dec.icon" style="width: 2rem"></i>
                        <span class="small font-weight-bold">{{node.title}}</span>
                    </div>
                </div>
            </div>

            <!--  Right Panel -->
            <div v-if="showRightPanel" :class="{'right-panel border-left bg-white':1,'hide-panel':!showRightPanel}" style="min-width: 22rem">
                <!-- Actions: Archive -->
                <div class="mb-2 d-flex p-2">
                    <!--  Delete Node -->
                    <button v-if="currentNode" @click="deleteNode" class="btn btn-link p-0 mx-2" title="Delete node">
                        <i class="fal fa-trash-alt fa-lg"></i>
                    </button>

                    <!--  Delete Link -->
                    <button v-if="currentLink" @click="deleteLink" class="btn btn-link p-0 mx-2" title="Delete link">
                        <i class="fal fa-trash-alt fa-lg"></i>
                    </button>

                    <!--  Duplicate -->
                    <button v-if="currentNode" @click="duplicateNode" class="btn btn-link p-0 mx-2" title="Duplicate">
                        <i class="fal fa-copy fa-lg"></i>
                    </button>

                    <!-- Link -->
                    <button v-if="currentNode" @click="linkNode" type="button" class="btn btn-link mx-2 p-0" title="Link">
                        <i class="fal fa-lg fa-external-link"></i>
                    </button>

                    <div class="mr-auto"></div>

                    <!--  Close button -->
                    <button @click="showRightPanel=false" title="Hide info panel" class="btn close-panel btn-link p-2"><i class="fal fa-times fa-lg"></i></button>
                </div>
                <div class="px-3" v-if="currentNode">
                    <details-view v-if="nodeObjectDec" class="compress-view" :data="currentNode" :dec="nodeObjectDec" :level="1"></details-view>
                    <details-view v-if="currentNodeObjectDec" class="compress-view" :data="currentNode" :dec="currentNodeObjectDec" :level="1"></details-view>
                </div>
                <div class="px-3" v-else-if="currentLink">
                    <details-view v-if="linkObjectDec" class="compress-view" :data="currentLink" :dec="linkObjectDec" :level="1"></details-view>
                </div>
                <div class="px-3">
                    Select the node for more details.
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {assignNullToEmptyProperty, call, clone, glob, notify, question} from "../main";
    import {Flowchart, Property, FlowchartDeclaration, FlowchartNodeLink, AccessPermission, FlowchartNode, FlowchartNodeDeclare, GlobalType, LogType, ObjectDec, Point, PropertyEditMode} from '../../../sys/src/types';

    @Component({name: 'FlowchartDesigner'})
    export default class FlowchartDesigner extends Vue {
        private flowchart: Flowchart = {nodes: [], title: "Loading ..."} as Flowchart;
        private dec: FlowchartDeclaration = {type: {nodes: []}} as FlowchartDeclaration;
        private draggingNodeDec: FlowchartNodeDeclare = null;
        private currentNode: FlowchartNode = null;
        private currentLink: any = null;
        private currentNodeObjectDec: ObjectDec = null;
        private nodeObjectDec: ObjectDec = null;
        private linkObjectDec: ObjectDec = null;
        private dirty = false;
        private tag = 0;
        private dragOffset: Point;
        private showRightPanel = true;
        private selectingLinkTarget = false;
        private links: {
            path: string,
            active: boolean,
            node: FlowchartNode,
            next: FlowchartNodeLink,
        }[] = [];

        duplicateNode() {

        }

        deleteLink() {
            question("Confirm", `Are you sure you want to delete the link?`,
                [{title: "Cancel", ref: "no", _cs: "btn btn-light ml-2"},
                    {title: "Delete link", ref: "yes", _cs: "btn btn-danger ml-2"}],
                null, (option: any) => {
                    if (option == "yes") {
                        let index = this.currentLink.node.nexts.indexOf(this.currentLink.next);
                        this.currentLink.node.nexts.splice(index, 1);
                        this.currentLink = null;
                        this.dirty = true;
                        this.extractLinks();
                    }
                });
        }

        deleteNode() {
            question("Confirm", `Are you sure you want to delete the node named '${this.currentNode.title}'?`,
                [{title: "Cancel", ref: "no", _cs: "btn btn-light ml-2"},
                    {title: "Delete node", ref: "yes", _cs: "btn btn-danger ml-2"}],
                null, (option: any) => {
                    if (option == "yes") {
                        for (let node of this.flowchart.nodes) {
                            if (!node.nexts) continue;
                            node.nexts = node.nexts.filter(next => next.node != this.currentNode.tag);
                        }

                        let index = this.flowchart.nodes.indexOf(this.currentNode);
                        this.flowchart.nodes.splice(index, 1);
                        this.currentNode = null;
                        this.extractLinks();
                    }
                });
        }

        linkNode() {
            this.selectingLinkTarget = true;
            notify(`Select target node!`, LogType.Debug);
        }

        selectLink(link) {
            this.links.forEach(l => l.active = false);
            this.currentNode = null;
            this.linkObjectDec = {
                access: AccessPermission.Full,
                properties: [{
                    title: "Condition", name: "type", _: {
                        gtype: GlobalType.id, isRef: true, items: [
                            {ref: "xxx", title: "xxx"},
                            {ref: "xxx22", title: "xxx22"}
                        ]
                    }
                }, {title: "Value", name: "value", _: {gtype: GlobalType.string}}]
            } as ObjectDec;
            let nextDec = link.node._.dec.nexts.find(n => n.name == link.next.type);
            if (nextDec && nextDec.parametric) {
                this.linkObjectDec.properties.push({title: "Value", name: "value", _: {gtype: GlobalType.string}} as Property)
            }
            for (const prop of this.linkObjectDec.properties) {
                assignNullToEmptyProperty(link, prop);
            }
            this.currentLink = link;
            link.active = true;
            this.dirty = true;
        }

        dragNodeDec(ev, node: FlowchartNodeDeclare) {
            ev.dataTransfer.effectAllowed = 'copy';
            this.draggingNodeDec = node;
        }

        selectNode(node: FlowchartNode) {
            this.currentNode = null;
            this.currentNodeObjectDec = {access: AccessPermission.Full, properties: node._.dec.params || []} as ObjectDec;
            this.currentNode = node;
            if (this.currentLink) this.currentLink.active = false;
            this.currentLink = null;
            this.$forceUpdate();
        }

        startMoveNode(ev, node: FlowchartNode) {
            if (this.selectingLinkTarget) {
                this.selectingLinkTarget = false;
                this.currentNode.nexts = this.currentNode.nexts || [];
                this.currentNode.nexts.push({node: node.tag, type: null, value: null});
                this.extractLinks();
                return;
            }

            ev.preventDefault();
            ev.stopPropagation();
            this.dragOffset = {x: ev.clientX, y: ev.clientY};
            this.selectNode(node);

            document.onmouseup = (ev) => {
                document.onmouseup = null;
                document.onmousemove = null;
                this.dirty = true;
            };

            document.onmousemove = (ev) => {
                ev.preventDefault();
                this.currentNode.point.x += ev.clientX - this.dragOffset.x;
                this.currentNode.point.y += ev.clientY - this.dragOffset.y;
                this.dragOffset = {x: ev.clientX, y: ev.clientY};
                this.extractLinks();
            }
        }

        apply() {
            let flowchart = clone(this.flowchart) as Flowchart;
            delete flowchart._;
            flowchart.nodes.forEach(node => delete node._);

            call("saveFlowchart", {flowchart}, (err, res) => {
                if (!err) {
                    notify(`Saved!`, LogType.Debug);
                    this.dirty = false;
                }
            });
        }

        isSelected(node: FlowchartNode) {
            return this.currentNode == node;
        }

        dragOver(e) {
            e.preventDefault();
        }

        dropNode(e) {
            e.preventDefault();

            if (this.draggingNodeDec) {
                let newNode = {
                    title: this.draggingNodeDec.title,
                    type: this.draggingNodeDec.name,
                    tag: ++this.tag,
                    point: {x: e.offsetX, y: e.offsetY},
                    _: {dec: this.draggingNodeDec}
                } as FlowchartNode
                this.flowchart.nodes.push(newNode);

                for (const prop of newNode._.dec.params) {
                    newNode.params = newNode.params || {};
                    assignNullToEmptyProperty(newNode, prop);
                }

                this.draggingNodeDec = null;
            }

            this.dirty = true;
        }

        refresh() {
            let flowchartID = location.pathname.replace(/.*flowchart-designer\/(\w+).*/, "$1");
            call("loadFlowchart", {flowchart: {"$oid": flowchartID}}, (err, res) => {
                this.flowchart = res.data;
                this.dec = this.flowchart._.type;
                this.dirty = false;

                for (let node of this.flowchart.nodes) {
                    node._ = {dec: this.dec.nodes.find(n => n.name == node.type)};
                    if (node._.dec) {
                        for (const prop of node._.dec.params) {
                            node.params = node.params || {};
                            assignNullToEmptyProperty(node, prop);
                        }
                    }
                }
                if (this.flowchart.nodes.some(n => !n._.dec)) {
                    notify(`Node '${this.flowchart.nodes.find(n => !n._.dec).title}' has invalid type!`, LogType.Error);
                    this.flowchart.nodes = this.flowchart.nodes.filter(n => n._.dec);
                    this.dirty = true;
                }

                this.tag = this.flowchart.nodes.length ? Math.max(...this.flowchart.nodes.map(n => n.tag)) : 0;
                this.$nextTick(() => {
                    this.extractLinks();
                });
            });
        }

        extractLinks() {
            this.links = [];

            for (let node of this.flowchart.nodes) {
                if (node.nexts) {

                    for (let next of node.nexts) {
                        let target = this.flowchart.nodes.find(n => n.tag == next.node);
                        if (!target) {
                            console.warn(`Target node #${next.node} not found!`);
                            let index = node.nexts.indexOf(next);
                            node.nexts.splice(index, 1);
                            this.dirty = true;
                            continue;
                        }

                        // Calculate path
                        let path = `M${node.point.x},${node.point.y} L${target.point.x},${node.point.y} L${target.point.x},${target.point.y}`;
                        this.links.push({path, active: false, node, next});
                    }
                }
            }
        }

        clickObjectMenu() {

        }

        created() {
            glob.infoPanel.show = false;
            this.nodeObjectDec = {
                access: AccessPermission.Full,
                properties: [
                    {title: "Title", name: "title", _: {gtype: GlobalType.string}},
                    {title: "Tag", name: "tag", editMode: PropertyEditMode.Readonly, _: {gtype: GlobalType.number}}
                ]
            } as ObjectDec;
            this.refresh();
        }
    }

</script>

<style lang="scss">
    .flowchart-designer {
        .main-canvas {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAT0lEQVQ4T2N8/fr/fwYiADfPP4avX5gIqmQEGSgqyshISOW373//c3EyE1Q3aiDukBwNQ5xhQ/1kAwpsQomaFHnqu3A06+EM/9GcQr+cAgBGqZrSrFyxegAAAABJRU5ErkJggg==);

            .node {
            }

            .node.circle {
                border-radius: 50px !important;
                padding: .9rem .6rem !important;

                span {
                    display: none;
                }
            }

            .node.active {
                border: 3px solid black !important;
                margin: -3px;
            }
        }

        .flowchart-content {
            aside {
                min-width: 12rem;
            }
        }

        .right-panel .details-view {
            .prop-label {
                width: 5rem;
            }

            .prop-value {
                width: 14rem;
            }

            .form-group {
                &.p_title {
                    textarea {
                        width: 100% !important;
                        min-height: 5rem !important;
                    }
                }

                &.p_description {
                    display: none;
                }
            }
        }
    }
</style>