<template>
    <div @click="clickgroup" tabindex="1" @drop="drop" @mouseup="mouseUp" @dragover="dragovergroup" @dragleave="dragOver=false" :class="{'drag-over':dragOver}">
        <div v-if="title" class="font-weight-bold py-1 text-primary">
            <i v-if="icon" :class="icon"></i>{{title}}
        </div>
        <label v-if="subtitle" class="small mb-0 font-weight-bold">{{subtitle}}</label>
        <div class="tasks-panel">
            <template v-for="task in tasks" v-if="isVisible(task)">
                <div class="w-100 d-flex align-items-center">
                    <i v-if="task.parent" class="fal fa-circle fa-xs mx-1 text-black-50"></i>
                    <!--                    <i v-if="task.children" class="fal fa-plus-square fa-sm mx-1 text-black-50"></i>-->
                    <div draggable="true" @dragstart="startdragtask($event,task)" @keydown="taskkeypress($event,task)" @mousedown="taskmousedown($event,task)"
                         :class="'task-item d-flex align-items-center border w-100 rounded ' + (task._.style || '') + (task._.multiPlace?' multi-place':'')">
                        <i @click="toggleExpand(task)" v-if="hasChild(task)" :class="{'fa-lg px-1':1,'fal fa-caret-down':!task._.expand,'fas fa-caret-right':task._.expand}"></i>
                        <input @change="changeTitle($event,task)" @keydown="inputKeyPress($event,task)" :readonly="!editingMode" v-model="task.title" class="px-1 border-0 w-100">
                    </div>
                </div>
            </template>
        </div>
        <input class="new-task mt-1 px-1 border-0 w-100 bg-transparent" @change="newtask">
        <input class="w-100 h-100 border-0 bg-transparent">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {Keys, ID, WebMethod, Task} from "../../../sys/src/types";
    import {ajax, equalID} from "../main";

    declare let $: any;

    @Component({name: 'TaskGroup'})
    export default class TaskGroup extends Vue {
        @Prop() private icon: string;
        @Prop() private title: string;
        @Prop() private subtitle: string;
        @Prop() private tasks: Task[];
        editingMode: boolean = false;
        dragOver: boolean = false;

        hasChild(task: Task) {
            return this.tasks.filter(t => equalID(t.parent, task._id)).length > 0;
        }

        isVisible(task: Task) {
            return !task._.expand || !task.parent;
        }

        toggleExpand(task: Task) {
            task._.expand = !task._.expand;
            this.tasks.filter(t => equalID(t.parent, task._id)).forEach(t => t._.expand = task._.expand);
            this.$forceUpdate();
        }

        @Emit('clickgroup')
        clickgroup(e) {
            return e;
        }

        @Emit('dropgroup')
        drop(e) {
            this.dragOver = false;
            return e;
        }

        mouseUp(e) {

        }

        changeTitle(ev, task) {
            this.editingMode = false;
            this.saveTask(task._id, {title: task.title} as Task);
        }

        saveTask(task: ID, patch: Task, done?) {
            ajax(`/tasks/${task}`, patch, {method: WebMethod.patch}, (res) => {
                console.log("Saved!");
                if (done) done(res);
            });
        }

        @Emit('dragovergroup')
        dragovergroup(event) {
            this.dragOver = true;
            return event;
        }

        inputKeyPress(ev, task) {
            switch (ev.which) {
                case Keys.f2:
                    this.editingMode = true;
                    return;
            }
        }

        taskkeypress(ev, task) {
            if (this.editingMode) return;
            this.raiseTaskkeypress(ev, task);
        }

        @Emit('taskkeypress')
        raiseTaskkeypress(ev, task) {
            return {ev, task};
        }

        @Emit('startdragtask')
        startdragtask(ev, task) {
            return {ev, task};
        }

        @Emit('newtask')
        newtask(e) {
            return e;
        }

        @Emit('taskmousedown')
        taskmousedown(ev, task) {
            return {ev, task};
        }
    }
</script>
