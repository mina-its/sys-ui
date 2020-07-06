<template>
    <div @click="clickgroup" @drop="drop" @dragover="dragovergroup">
        <div class="font-weight-bold pt-1 text-primary">
            <i v-if="icon" :class="icon"></i>{{title}}
        </div>
        <label v-if="subtitle" class="small mb-0 font-weight-bold">{{subtitle}}</label>
        <div class="tasks-panel">
            <template v-for="task in tasks">
                <div class="w-100 d-flex align-items-center">
                    <i v-if="task.parent" class="fal fa-circle fa-xs mx-1 text-black-50"></i>
<!--                    <i v-if="task.children" class="fal fa-plus-square fa-sm mx-1 text-black-50"></i>-->
                    <input :readonly="!editingMode" @keydown="taskkeypress($event,task)" @mousedown="taskmousedown($event,task)" v-model="task.title" draggable="true"
                           @dragstart="startdragtask($event,task)"
                           :class="'task-item px-1 border w-100 rounded ' + (task._.style || '')">
                </div>
            </template>
        </div>
        <input class="new-task mt-1 px-1 border-0 w-100 bg-transparent" @change="newtask">
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Emit} from 'vue-property-decorator';
    import {ObjectViewType, Task} from "../../../sys/src/types";
    import sys from "../../../sys-ui";

    @Component({name: 'TaskManagerGroup'})
    export default class TaskManagerGroup extends Vue {
        @Prop() private icon: string;
        @Prop() private title: string;
        @Prop() private subtitle: string;
        @Prop() private editingMode: boolean;
        @Prop() private tasks: Task[];

        @Emit('clickgroup')
        clickgroup(e) {
            return e;
        }

        @Emit('dropgroup')
        drop(e) {
            return e;
        }

        @Emit('dragovergroup')
        dragovergroup(event) {
            return event;
        }

        @Emit('taskkeypress')
        taskkeypress(ev, task) {
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
