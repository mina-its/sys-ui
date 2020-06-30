<template>
    <div @click="clickgroup" @drop="drop" @dragover="dragovergroup" class="task-manager-group border bg-light p-2">
        <div class="font-weight-bold text-primary">
            <i v-if="icon" :class="icon"></i>{{title}}
        </div>
        <div class="tasks-panel">
            <input :readonly="!editingMode" @keydown="taskkeypress($event,task)" @mousedown="taskmousedown($event,task)" v-model="task.title" draggable="true"
                   @dragstart="startdragtask($event,task)" @drag="dragingtask" v-for="task in tasks" class="task-item mt-1 px-1 border w-100 rounded">
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
        dragovergroup(e) {
            return e;
        }

        @Emit('taskkeypress')
        taskkeypress(e, task) {
            return {e, task};
        }

        @Emit('startdragtask')
        startdragtask(e, task) {
            return {e, task};
        }

        @Emit('dragingtask')
        dragingtask(e, task) {
            return {e, task};
        }

        @Emit('newtask')
        newtask(e) {
            return e;
        }

        @Emit('taskmousedown')
        taskmousedown(e, task) {
            return {e, task};
        }
    }
</script>

<style scoped lang="scss">

</style>
