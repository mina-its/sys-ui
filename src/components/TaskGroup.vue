<template>
    <div @click="clickGroup" @drop="drop" @dragenter="dragEnterGroup" @dragover="dragovergroup" class="noselect task-group">
        <div v-if="group.title" class="font-weight-bold py-1 text-primary">
            <i v-if="group.icon" :class="group.icon"></i>{{group.title}}
        </div>
        <div v-if="group.subtitle" class="d-flex">
            <label class="small mb-0 font-weight-bold" v-html="group.subtitle"></label>
            <div class="mr-auto"></div>
            <i v-if="milestone" :title="milestone" class="fad text-danger fa-pennant"></i>
        </div>
        <div class="tasks-panel">
            <div v-for="task in group.tasks" v-if="isVisible(task)" class="w-100 d-flex align-items-center" @dragenter="dragEnterTask($event,task)">
                <i v-if="task.parent" class="fal fa-genderless fa-xs mx-2 text-black-50"></i>
                <div tabindex="0" draggable="true" @dragend="dragEnd($event,task)" @dragstart="dragStart($event,task)" @keydown="taskkeypress($event,task)" @focus="focusTask(task)"
                     :class="{'task-item text-nowrap d-flex align-items-center border w-100 rounded': 1, 'multi-place':task._.multiPlace,'dragging': task._.dragging}"
                     :style="{'color':task._.color,'background-color':task._.bgColor}">
                    <i v-if="task.archive" class="px-1 fal fa-archive"></i>
                    <div class="px-1 w-100 overflow-hidden" style="text-overflow: ellipsis">{{taskCaption(task)}}</div>
                    <div class="font-weight-bold" v-html="getTaskTime(task)"></div>
                    <i @click="toggleExpand(task)" v-if="hasChild(task)" :class="{'fa-lg px-1':1,'fal fa-angle-up':task.collapse,'fas fa-angle-down':!task.collapse}"></i>
                </div>
            </div>
        </div>
        <input class="new-task outline-0 mt-1 px-1 border-0 w-100 bg-transparent mb-3" @keydown.esc="$event.target.value=null" @change="newTask">
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import {ID, Task, TaskView, TaskDueDate, WebMethod} from "../../../sys/src/types";
    import {ajax, equalID} from "../main";
    import {TaskEvent, TaskGroupData} from "../types";

    declare let $, moment: any;

    @Component({name: 'TaskGroup'})
    export default class TaskGroup extends Vue {
        @Prop() private group: TaskGroupData;
        @Prop() private milestone: string;

        @Emit('dragEnd')
        dragEnd(ev, task) {
            return {ev, task, group: this.group} as TaskEvent;
        }

        hasChild(task: Task) {
            return this.group.tasks.filter(t => equalID(t.parent, task._id)).length > 0;
        }

        taskCaption(task: Task) {
            let title = task.title || "";
            if (title.split(" ").length < 6)
                return title;
            else {
                title = `#${task.no}`;
                if (task.categories && task.categories.length)
                    title += " " + task.categories.map(c => `#${c}`).join(' ');
            }
            return title;
        }

        @Emit('dragEnterTask')
        dragEnterTask(ev, task) {
            return {ev, task, group: this.group} as TaskEvent;
        }

        @Emit('dragEnterGroup')
        dragEnterGroup(ev) {
            return {ev, group: this.group} as TaskEvent;
        }

        getTaskTime(task: Task) {
            if (!task.dueDates) return "";

            let dueDate: TaskDueDate = null;
            if (task.dueDates.length == 1)
                dueDate = task.dueDates[0].setTime ? task.dueDates[0] : null;
            else {
                switch (this.group.concern) {
                    case TaskView.Start:
                        dueDate = task.dueDates.find(d => d.setTime && this.datePeriodContains(d.time, this.today()));
                        break;

                    case TaskView.DueDate:
                        if (this.group.value)
                            dueDate = task.dueDates.find(d => d.setTime && this.group.value.diff(d.time) <= 0 && moment(this.group.value).add(1, 'days').diff(d.time) > 0);
                        break;
                }
            }

            return dueDate ? "<span>&nbsp;<span>" + moment(dueDate.time).format("HH:mm") + "<span>&nbsp;<span>" : "";
        }

        today() {
            let today = moment().startOf('day');
            return today;
        }

        datePeriodContains(time: Date, date: any) {
            return date.diff(time) <= 0 && moment(date).add(1, 'days').diff(time) > 0;
        }

        isVisible(task: Task) {
            return task.collapse || !task.parent;
        }

        @Emit('toggleExpand')
        toggleExpand(task: Task) {
            return task;
        }

        clickGroup(ev) {
            $(".task-group.active").removeClass("active");
            $(ev.target).closest(".task-group").addClass("active");
            $(ev.target).find(".new-task").focus();
        }

        @Emit('drop')
        drop(ev) {
            return {ev, group: this.group};
        }

        saveTask(task: ID, patch: Task, done?) {
            ajax(`/tasks/${task}`, patch, {method: WebMethod.patch}, (res) => {
                console.log("Saved!");
                if (done) done(res);
            });
        }

        @Emit('dragovergroup')
        dragovergroup(ev) {
            ev.preventDefault();
            return {ev, group: this.group} as TaskEvent;
        }

        @Emit('taskkeypress')
        taskkeypress(ev, task) {
            return {ev, task, group: this.group} as TaskEvent;
        }

        @Emit('dragStart')
        dragStart(ev, task: Task) {
            return {ev, task, group: this.group} as TaskEvent;
        }

        @Emit('newTask')
        newTask(ev) {
            return {ev, group: this.group};
        }

        @Emit('focusTask')
        focusTask(task) {
            return {task, group: this.group} as TaskEvent;
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

            &:not(.calendar-day) {
                min-width: 12rem;
            }

            &.calendar-day.active {
                overflow: visible;
                position: absolute;
                height: unset !important;
                max-width: 15rem;
                background-color: #f5f5f5;
                border-right: 1px solid #bbb;
                border-bottom: 1px solid #bbb;
                /*-ms-overflow-style: unset;*/
                /*scrollbar-width: unset;*/
            }


            &::-webkit-scrollbar {
                display: none;
            }

            /*&:hover::-webkit-scrollbar {*/
            /*    display: unset;*/
            /*}*/
        }

        .new-task {
            font-size: .8rem;
        }
    }
</style>