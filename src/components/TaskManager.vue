<template>
    <div class="task-manager h-100 d-flex flex-column flex-fill overflow-auto">
        <!--  Toolbar -->
        <div class="d-flex p-2 align-items-center btn-toolbar separator-line toolbar" role="toolbar">
            <!--  Project -->
            <div class="project-filter dropdown mr-2">
                <button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" type="button"
                        :class="{'toolbar-button btn mx-1':1, 'btn-secondary': !!currentProject, 'btn-outline-secondary':!currentProject}">
                    <i class="fal fa-construction fa-lg"></i>
                    <label v-if="currentProject">{{currentProject.title}}</label>
                    <label v-else>All Projects</label>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item py-2" href="#" @click="currentProject=null">All Projects</a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item py-2" href="#" @click="currentProject=project"
                       v-for="project of this.profile.projects">{{project.title}}</a>
                </div>
            </div>

            <!--  Concern -->
            <div class="btn-group mr-2" role="group" aria-label="First group">
                <label class="font-weight-bold text-uppercase input-group-text mb-1 concern-label">Concern</label>
                <button @click="activateConcern(TaskConcern_Start)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_Start===profile.concern}">
                    <i class="fal fa-inbox fa-lg"></i>
                    <label>Start</label>
                </button>
                <button @click="activateConcern(TaskConcern_Status)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_Status===profile.concern}">
                    <i class="fal fa-ballot-check fa-lg"></i>
                    <label>Status</label>
                </button>
                <button @click="activateConcern(TaskConcern_DueDate)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_DueDate===profile.concern}">
                    <i class="fal fa-calendar-alt fa-lg"></i>
                    <label>Due Date</label>
                </button>
                <button @click="activateConcern(TaskConcern_Assignee)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_Assignee===profile.concern}">
                    <i class="fal fa-users fa-lg"></i>
                    <label>Assignee</label>
                </button>
                <button v-if="currentProject" @click="activateConcern(TaskConcern_MileStone)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_MileStone===profile.concern}">
                    <i class="fal fa-pennant fa-lg"></i>
                    <label>Milestone</label>
                </button>
                <button v-if="currentProject" @click="activateConcern(TaskConcern_Category)" type="button"
                        :class="{'btn btn-secondary toolbar-button':1,'active':TaskConcern_Category===profile.concern}">
                    <i class="fal fa-layer-group fa-lg"></i>
                    <label>Category</label>
                </button>
            </div>

            <!--  Filter -->
            <div class="dropdown">
                <button id="filterButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        type="button" class="toolbar-button btn btn-outline-secondary mx-1">
                    <i class="fal fa-filter fa-lg"></i>
                    <label>Filter</label>
                </button>
                <div v-if="profile.filter" class="dropdown-menu filter-panel p-3" aria-labelledby="filterButton">
                    <form class="d-flex">
                        <div class="filter-item mx-2">
                            <label class="font-weight-bold">Status</label>
                            <check-box v-for="item of getFilterItems(TaskConcern_Status)" :checked="item.checked"
                                       @changed="filterItemCheckChanged($event, item, TaskConcern_Status)"
                                       :label="item.title"></check-box>
                        </div>
                        <!--                        <div class="filter-item mx-2 filter-duedate">-->
                        <!--                            <label class="font-weight-bold mb-2 mt-1">Due Dates</label>-->
                        <!--                            <prop-time placeHolder="Range from" :doc="{}" :prop="{}"></prop-time>-->
                        <!--                            <prop-time placeHolder="Range To" :doc="{}" :prop="{}"></prop-time>-->
                        <!--                        </div>-->
                        <div class="filter-item mx-2">
                            <label class="font-weight-bold">Priority</label>
                            <check-box v-for="item of getFilterItems(TaskConcern_Priority)" :checked="item.checked"
                                       @changed="filterItemCheckChanged($event, item, TaskConcern_Priority)"
                                       :label="item.title"></check-box>
                        </div>
                        <div class="filter-item mx-2">
                            <label class="font-weight-bold">Assignees</label>
                            <check-box v-for="item of getFilterItems(TaskConcern_Assignee)" :checked="item.checked"
                                       @changed="filterItemCheckChanged($event, item, TaskConcern_Assignee)"
                                       :label="item.title"></check-box>
                        </div>
                        <div v-if="currentProject" class="filter-item mx-2">
                            <label class="font-weight-bold">Milestones</label>
                            <check-box v-for="item of getFilterItems(TaskConcern_MileStone)" :checked="item.checked"
                                       @changed="filterItemCheckChanged($event, item, TaskConcern_MileStone)"
                                       :label="item.title"></check-box>
                        </div>
                        <div v-if="currentProject" class="filter-item mx-2">
                            <label class="font-weight-bold">Categories</label>
                            <check-box v-for="item of getFilterItems(TaskConcern_Category)" :checked="item.checked"
                                       @changed="filterItemCheckChanged($event, item, TaskConcern_Category)"
                                       :label="item.title"></check-box>
                        </div>
                    </form>
                    <button class="btn btn-success px-5 mt-2">Apply</button>
                </div>
            </div>

            <!--  Coloring -->
            <button type="button" class="toolbar-button btn btn-outline-secondary mx-1 px-1">
                <i class="fal fa-adjust fa-lg"></i>
                <label>Coloring</label>
            </button>

            <!--  Sub Task -->
            <button type="button" class="toolbar-button btn btn-outline-secondary mx-1 px-1">
                <i class="fal fa-arrow-square-right fa-lg"></i>
                <label>Sub Task</label>
            </button>
            <div class="flex-grow-1"></div>

            <!-- Profile -->
            <button type="button" class="btn btn-outline-secondary toolbar-button m-1">
                <i class="fal fa-head-vr px-2 fa-lg"></i>
                <label>Profiles</label>
            </button>

            <!-- Feedback -->
            <button type="button" class="btn btn-outline-secondary toolbar-button m-1">
                <i class="fal fa-comment-lines px-2 fa-lg"></i>
                <label>Feedback</label>
            </button>

            <!-- Settings -->
            <button type="button" class="btn btn-outline-secondary m-1 toolbar-button">
                <i class="fal fa-cog px-2 fa-lg"></i>
                <label>Settings</label>
            </button>
        </div>

        <!--  Content -->
        <div class="w-100 h-100 overflow-auto d-flex task-manager-content">
            <!--  Calendar -->
            <div class="calendar w-100 h-100 d-flex" v-if="TaskConcern_DueDate===profile.concern">
                <task-manager-group :tasks="unscheduledTasks" title="Unscheduled" @dragingtask="dragging"
                                    @startdragtask="dragStart"
                                    @taskmousedown="taskMouseDown" @taskkeypress="taskKeypress" @clickgroup="clickGroup"
                                    @newtask="newTask($event, null)"
                                    @dropgroup="drop($event,null)" @dragovergroup="allowDrop"
                                    :editingMode="taskEditingMode"></task-manager-group>
                <table class="w-100 h-100 flex-fill">
                    <tr v-for="row of calendarRows" class="">
                        <td v-for="day of row.days" class="align-top border">
                            <div :class="day.style" @drop="dropToDay($event, day)" @dragover="allowDropDay($event, day)"
                                 @dragleave="dragLeave($event, day)">
                                <div v-if="day.day"
                                       class="small mb-0 mt-1 font-weight-bold text-primary mr-2">{{day.day}}</div>
                                <label class="small mb-0 font-weight-bold">{{day.title}}</label>
                                <input :readonly="!taskEditingMode" @keydown="taskKeypress($event,task)"
                                       @mousedown="currentTask=task" v-model="task.title" draggable="true"
                                       @dragstart="dragStart($event,task)" @drag="dragging" v-for="task in day.tasks"
                                       class="task-item mb-1 px-1 border w-100 rounded">
                                <input class="new-task px-1 border-0 h-100 w-100 bg-transparent"
                                       @change="newTask($event,null)">
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <!--  Columns -->
            <task-manager-group v-else v-for="group in taskGroups" :tasks="group.tasks" :title="group.title"
                                @dragingtask="dragging" @startdragtask="dragStart"
                                @taskmousedown="taskMouseDown" @taskkeypress="taskKeypress" @clickgroup="clickGroup"
                                @newtask="newTask($event, group)"
                                @dropgroup="drop($event,group)" @dragovergroup="allowDrop" :icon="group.icon"
                                :editingMode="taskEditingMode"></task-manager-group>

            <div class="flex-grow-1"></div>

            <!--  Task Properties -->
            <div v-if="currentTask" class="task-properties border bg-white p-3">
                <div class="font-weight-bold">Task title:</div>
                <input class="w-100" v-model="currentTask.title">
                <div class="font-weight-bold mt-2">Comment:</div>
                <textarea class="w-100" v-model="currentTask.comment"></textarea>
            </div>
        </div>

        <!--  Filter -->
        <div class="filter-panel">

        </div>

        <div class="order-line"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {
        Task,
        WebMethod,
        ID,
        Keys,
        TaskConcern,
        TaskManagerProfile,
        TaskPriority,
        TaskStatus,
        Project
    } from '../../../sys/src/types';
    import {call, ajax, question, equalID} from '@/main';
    import CheckBox from "@/components/CheckBox.vue";
    import PropTime from "@/components/PropTime.vue";
    import TaskManagerGroup from "@/components/TaskManagerGroup.vue";

    declare let $, moment: any;

    @Component({
        name: 'TaskManager',
        components: {TaskManagerGroup}
    })
    export default class TaskManager extends Vue {
        private tasks: Task[];
        private profile: TaskManagerProfile = {concern: TaskConcern.Start} as TaskManagerProfile;
        private taskGroups: { title?: string, icon?: string, value: any, tasks: Task[] }[] = [];
        private calendarRows: {
            days: {
                title: string,
                date: any,
                day: string,
                style: string,
                tasks: Task[]
            }[]
        }[] = [];
        private unscheduledTasks: Task[] = [];
        private concernProperty: string;
        private TaskConcern_Start = TaskConcern.Start;
        private TaskConcern_Status = TaskConcern.Status;
        private TaskConcern_DueDate = TaskConcern.DueDate;
        private TaskConcern_Assignee = TaskConcern.Assignee;
        private TaskConcern_Priority = TaskConcern.Priority;
        private TaskConcern_Category = TaskConcern.Category;
        private TaskConcern_MileStone = TaskConcern.MileStone;
        private currentTask: Task = null;
        private currentProject: Project = null;
        private taskEditingMode: boolean = false;
        private dragOffset = null;
        private groupItems: { title: string, value: any, icon?: string }[];

        created() {
            call('getTasks', {}, (err, res) => {
                this.tasks = res.data.tasks;
                this.profile = res.data.profile;
                this.activateConcern(TaskConcern.Status);
            });
        }

        getFilterItems(concern: TaskConcern) {
            let items;
            switch (concern) {
                case TaskConcern.Status:
                    items = [{title: 'All', checked: this.profile.filter.statuses == null, value: null}];
                    if (this.profile.filter.statuses) {
                        for (let item in TaskStatus) {
                            if (!isNaN(Number(item)))
                                items.push({
                                    title: TaskStatus[item],
                                    checked: this.profile.filter.statuses.indexOf(Number(item)) > -1,
                                    value: Number(item)
                                });
                        }
                    }
                    break;

                case TaskConcern.Assignee:
                    items = [{title: 'All', checked: this.profile.filter.assignees == null, value: null}];
                    if (this.profile.filter.assignees) {
                        for (let user of this.profile.users) {
                            items.push({
                                title: user.title,
                                checked: this.profile.filter.assignees.indexOf(user._id) > -1,
                                value: user._id
                            });
                        }
                    }
                    break;

                case TaskConcern.MileStone:
                    items = [{title: 'All', checked: this.profile.filter.milestones == null, value: null}];
                    if (this.profile.filter.milestones) {
                        for (let milestone of this.currentProject.milestones) {
                            items.push({
                                title: milestone.title,
                                checked: this.profile.filter.milestones.indexOf(milestone._id) > -1,
                                value: milestone._id
                            });
                        }
                    }
                    break;

                case TaskConcern.Category:
                    items = [{title: 'All', checked: this.profile.filter.categories == null, value: null}];
                    if (this.profile.filter.categories) {
                        for (let category of this.currentProject.categories) {
                            items.push({
                                title: category,
                                checked: this.profile.filter.categories.indexOf(category) > -1,
                                value: category
                            });
                        }
                    }
                    break;
            }
            return items;
        }

        filterItemCheckChanged($event, item, concern: TaskConcern) {
            switch (concern) {
                case TaskConcern.Status:
                    if (item.value == null) // All
                        this.profile.filter.statuses = $event.val ? null : [];
                    else {
                        let index = this.profile.filter.statuses.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.statuses.push(item.value);
                        } else {
                            if (index != -1)
                                this.profile.filter.statuses.splice(index, 1);
                        }
                    }
                    break;

                case TaskConcern.Assignee:
                    if (item.value == null) // All
                        this.profile.filter.assignees = $event.val ? null : [];
                    else {
                        let index = this.profile.filter.assignees.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.assignees.push(item.value);
                        } else {
                            if (index != -1)
                                this.profile.filter.assignees.splice(index, 1);
                        }
                    }
                    break;

                case TaskConcern.MileStone:
                    if (item.value == null) // All
                        this.profile.filter.milestones = $event.val ? null : [];
                    else {
                        let index = this.profile.filter.milestones.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.milestones.push(item.value);
                        } else {
                            if (index != -1)
                                this.profile.filter.milestones.splice(index, 1);
                        }
                    }
                    break;

                case TaskConcern.Category:
                    if (item.value == null) // All
                        this.profile.filter.categories = $event.val ? null : [];
                    else {
                        let index = this.profile.filter.categories.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.categories.push(item.value);
                        } else {
                            if (index != -1)
                                this.profile.filter.categories.splice(index, 1);
                        }
                    }
                    break;
            }
            this.$forceUpdate();
        }

        mounted() {
            $('[data-toggle="tooltip"]').tooltip().on('click', function () {
                $(this).tooltip("hide");
            });
        }

        refreshTasks() {
            this.taskGroups = [];
            for (let group of this.groupItems) {
                let tasks = this.tasks.filter(task => {
                    if (Array.isArray(task[this.concernProperty])) {
                        for (let item of task[this.concernProperty]) {
                            if (equalID(item, group.value))
                                return true;
                        }
                        return false;
                    } else
                        return equalID(task[this.concernProperty], group.value);
                });
                this.taskGroups.push({title: group.title, tasks, value: group.value, icon: group.icon});
            }

            // let allValues = this.groupItems.map(e => e.value);
            // this.taskGroups.unshift({icon: 'fad fa-fog fa-lg', title: 'Brainstorm', value: null, tasks: this.tasks.filter(task => task[this.concernProperty] == null || allValues.indexOf(task[this.concernProperty]) == -1)});
        }

        dragStart(event) {
            event.e.dataTransfer.setData("Text", event.task._id);
            event.e.dataTransfer.effectAllowed = 'move';
            this.currentTask = event.task;
        }

        taskMouseDown(e) {
            this.currentTask = e.task;
        }

        dragging(event) {
            // console.log(event.x, event.y);
        }

        dragLeave(e, day) {
            day.style = day.style.replace(/drag-hover/, '');
            e.preventDefault();
        }

        allowDropDay(e, day) {
            day.style = day.style.replace(/ drag-hover/, '') + " drag-hover";
            e.preventDefault();
        }

        allowDrop(event) {
            event.preventDefault();
        }

        clickGroup(event) {
            $(event.target).find(".new-task").focus();
        }

        dropToDay(event, day) {
            event.preventDefault();
            day.style = day.style.replace(/drag-hover/, '');
            if (!this.currentTask.dueDates) this.currentTask.dueDates = [];
            this.currentTask.dueDates.push(day.date);
            let patch = {} as Task;
            patch.dueDates = this.currentTask.dueDates;
            this.saveTask(this.currentTask._id, patch);
            this.refreshTasks();
            this.currentTask = null;
        }

        drop(event, group) {
            event.preventDefault();
            this.currentTask[this.concernProperty] = group.value;
            let patch = {} as Task;
            patch[this.concernProperty] = group.value;
            this.saveTask(this.currentTask._id, patch);
            this.refreshTasks();
            this.currentTask = null;
        }

        saveTask(task: ID, patch: Task) {
            ajax(`/tasks/${task}`, patch, {method: WebMethod.patch}, (res) => {
                console.log("Saved!");
            });
        }

        taskKeypress(event) {
            this.currentTask = event.task;
            switch (event.e.which) {
                case Keys.del:
                    if (this.taskEditingMode) return;
                    question("Delete confirm", "Are you sure to delete this task?", [{
                            title: "YES",
                            ref: "yes"
                        }, {title: "NO", ref: "no", _cs: "btn btn-dark"}],
                        null, (option) => {
                            if (option == "yes") {
                                ajax(`/tasks/${event.task._id}`, null, {method: WebMethod.del}, (res) => {
                                    this.tasks.splice(this.tasks.indexOf(event.task), 1);
                                    this.refreshTasks();
                                });
                            }
                        });
                    break;

                case Keys.enter:
                    if (this.taskEditingMode)
                        this.saveTask(event.task._id, {title: event.task.title} as Task);
                    this.taskEditingMode = !this.taskEditingMode;
                    break;
            }
        }

        activateConcern(concern: TaskConcern) {
            this.profile.concern = concern;
            switch (concern) {
                case TaskConcern.Status:
                    this.concernProperty = "status";
                    this.groupItems = [
                        {title: "To Do", value: 1},
                        {title: "Doing", value: 2},
                        {title: "Verify", value: 5},
                        {title: "Done", value: 3},
                        {title: "On Hold", value: 4}
                    ];
                    break;

                case TaskConcern.Start:
                    this.concernProperty = null;
                    this.groupItems = [
                        {title: "Brainstorm", value: 1, icon: 'fad fa-fog fa-lg'},
                        {title: "To Do (Today)", value: 2},
                        {title: "Doing (Today)", value: 3},
                        {title: "Urgent", value: 4},
                        {title: "Overdue", value: 5},
                    ];
                    break;

                case TaskConcern.DueDate:
                    this.concernProperty = "dueDates";
                    this.calendarRows = [];
                    let firstDay = moment().startOf('week').date() % 7;
                    let date = moment().startOf('month').add(-firstDay - 7, 'days');

                    for (let i = 0; i < 7; i++) {
                        let row = {days: []};
                        this.calendarRows.push(row);

                        for (let d = 0; d < 7; d++) {
                            let style = "calendar-day ";
                            if (date >= moment().startOf('month') && date < moment().startOf('month').add(1, 'month'))
                                style += "this-month";
                            if (date.format("D MMM") == moment().startOf('day').format("D MMM"))
                                style += " today";

                            let title = date.date() == 1 ? date.format("D MMMM") : date.format("D");
                            if (d == 0 && i == 0)
                                title = date.format("D MMMM");

                            let day = {
                                title,
                                tasks: this.tasks.filter(task => Array.isArray(task.dueDates) && task.dueDates.find(d => date.diff(moment(d), 'days') == 0)),
                                date: date,
                                style,
                                day: i == 0 ? date.format("ddd") : ""
                            };
                            date = date.add(1, 'days');
                            row.days.push(day);
                        }
                    }

                    this.unscheduledTasks = this.tasks.filter(task => !task.dueDates || !task.dueDates.length);
                    break;

                case TaskConcern.Assignee:
                    this.concernProperty = "assignees";
                    this.groupItems = this.profile.users.map(user => {
                        return {title: user.title, value: user._id}
                    });
                    this.groupItems.unshift({title: "[Unassigned]", value: null});
                    break;

                case TaskConcern.MileStone:
                    this.concernProperty = "milestone";
                    this.groupItems = this.currentProject.milestones.map(milestone => {
                        return {title: milestone.title, value: milestone._id}
                    });
                    break;

                case TaskConcern.Category:
                    this.concernProperty = "categories";
                    this.groupItems = this.currentProject.categories.map(category => {
                        return {title: category, value: category}
                    });
                    break;
            }
            this.refreshTasks();
        }

        newTask(e, group) {
            if (e.target.value) {
                let task = {title: e.target.value, _id: ID.generateByBrowser()} as Task;
                task["_new"] = true;
                task[this.concernProperty] = group.value;
                this.tasks.push(task);
                this.refreshTasks();
                e.target.value = "";
                ajax(`/tasks`, task, {method: WebMethod.post}, (res) => {
                    console.log("Saved!");
                });
            }
        }
    }
</script>

<style lang="scss">
    .task-manager {
        .moving-box {
            position: absolute;
            padding: 0 0.25rem;
            font-size: .8rem;
            box-sizing: border-box;
            background-color: white;
            border: 1px solid #dee2e6;
            border-radius: 0.25rem;
        }

        .task-manager-group {
            width: 15rem;
        }

        .toolbar-button {
            min-width: 4rem;
            margin-bottom: .2rem;

            label {
                display: block;
                cursor: pointer;
                font-size: x-small;
                white-space: nowrap;
                margin-bottom: 0;
            }

            &.btn-outline-secondary label {
                font-weight: bold;
            }
        }

        .toolbar-button-project {
            margin-bottom: .2rem;

            label {
                display: block;
                font-weight: bold;
                cursor: pointer;
                font-size: x-small;
                white-space: nowrap;
                margin-bottom: 0;
            }
        }

        .task-properties {
            width: 15rem;
            font-size: .8rem;
        }

        .new-task {
            outline: none;
            font-size: .8rem;
        }

        .task-item {
            font-size: .8rem;
            background-color: white;
            cursor: default;

            &.hover {
                background-color: gray !important;
            }

            input {
                background-color: transparent;
                cursor: default;
            }
        }

        .filter-panel {
            label {
                white-space: nowrap;
                font-size: .8rem;
                display: block;
            }

            .filter-duedate {
                .prop-time {
                    width: 100px;
                }

                font-size: .8rem;
            }
        }

        .project-filter {
            .dropdown-item {
                font-size: small;
            }

            .dropdown-item:hover {
                background-color: #555;
                color: white;
            }
        }

        .concern-label {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .calendar {
            table {
                table-layout: fixed;
            }

            label {
                color: gray;
            }

            .calendar-day {
                padding: 0 .2rem;
                height: 100%;
            }

            .this-month label {
                color: black;
            }

            .today label {
                background-color: black;
                color: white;
                padding: 0 .3rem;
                border-radius: .2rem;
            }

            .drag-hover {
                outline: 1px solid black;
            }
        }
    }
</style>
