<template>
    <div @click="clickgroup" @drop="drop" @mouseup="mouseUp" @dragover="dragovergroup" @dragleave="dragOver=false" :class="{'task-group':1,'drag-over':dragOver}">
        <div v-if="group.title" class="font-weight-bold py-1 text-primary">
            <i v-if="group.icon" :class="group.icon"></i>{{group.title}}
        </div>
        <label v-if="group.subtitle" class="small mb-0 font-weight-bold" v-html="group.subtitle"></label>
        <div class="tasks-panel">
            <template v-for="task in group.tasks" v-if="isVisible(task)">
                <div class="w-100 d-flex align-items-center">
                    <i v-if="task.parent" class="fal fa-genderless fa-xs mx-2 text-black-50"></i>
                    <!--                    <i v-if="task.children" class="fal fa-plus-square fa-sm mx-1 text-black-50"></i>-->
                    <div draggable="true" @dragstart="startdragtask($event,task)" @keydown="taskkeypress($event,task)" @mousedown="taskmousedown(task)"
                         :class="'task-item d-flex align-items-center border w-100 rounded ' + (task._.style || '') + (task._.multiPlace?' multi-place':'')">
                        <i v-if="task.archive" class="px-1 fal fa-archive"></i>
                        <div class="font-weight-bold" v-html="getTaskTime(task)"></div>
                        <input @change="changeTitle($event,task)" @keydown="inputKeyPress($event,task)" :readonly="!editingMode" v-model="task.title" class="px-1 border-0 w-100">
                        <i @click="toggleExpand(task)" v-if="hasChild(task)" :class="{'fa-lg px-1':1,'fal fa-angle-up':!task._.expand,'fas fa-angle-down':task._.expand}"></i>
                    </div>
                </div>
            </template>
        </div>
        <input class="new-task mt-1 px-1 border-0 w-100 bg-transparent" @change="newtask">
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {ID, Keys, Task, TaskConcern, WebMethod} from "../../../sys/src/types";
    import {ajax, equalID} from "../main";
    import {TaskGroupData} from "../types";

    declare let $, moment: any;

    @Component({name: 'TaskGroup'})
    export default class TaskGroup extends Vue {
        @Prop() private group: TaskGroupData;
        editingMode: boolean = false;
        dragOver: boolean = false;

        hasChild(task: Task) {
            return this.group.tasks.filter(t => equalID(t.parent, task._id)).length > 0;
        }

        getTaskTime(task: Task) {
            if (this.group.concern == TaskConcern.DueDate && this.group.value) {
                let dueDate = task.dueDates.find(d => d.setTime && this.group.value.diff(d.time) <= 0 && moment(this.group.value).add(1, 'days').diff(d.time) > 0);
                if (dueDate) {
                    return "<span>&nbsp;<span>" + moment(dueDate.time).format("HH:mm") + "<span>&nbsp;<span>";
                } else {
                    return "";
                }
            }
            return "";
        }

        isVisible(task: Task) {
            return !task._.expand || !task.parent;
        }

        toggleExpand(task: Task) {
            task._.expand = !task._.expand;
            this.group.tasks.filter(t => equalID(t.parent, task._id)).forEach(t => t._.expand = task._.expand);
            this.$forceUpdate();
        }

        @Emit('clickgroup')
        clickgroup(e) {
            return e;
        }

        @Emit('drop')
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
        dragovergroup(ev) {
            this.dragOver = true;
            ev.preventDefault();
            return ev;
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
        taskmousedown(task) {
            return {task, group: this.group};
        }
    }
</script>

<style lang="scss">
    .task-manager {
        .task-group {
            width: 15rem;
            overflow: auto;
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
            transition: background-color .2s;

            &:hover {
                -ms-overflow-style: unset;
                scrollbar-width: unset;
            }


            &::-webkit-scrollbar {
                display: none;
            }

            &:hover::-webkit-scrollbar {
                display: unset;
            }

            &.drag-over {
                background-color: rgba(0, 140, 255, 0.05) !important;
            }
        }

    }
</style>