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
                    <button class="btn btn-link dropdown-item py-2" @click="filterProject(null)">All
                        Projects
                    </button>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item py-2" href="javascript:void(0);" @click="filterProject(project)"
                       v-for="project of this.profile.projects">{{project.title}}</a>
                </div>
            </div>

            <!--  Concern -->
            <div class="concerns btn-group" role="group" aria-label="First group">
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
                    <label>Calendar</label>
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

            <!--  Profiles -->
            <div class="dropdown mr-2">
                <button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" type="button"
                        :class="{'toolbar-button btn mx-1':1, 'btn-primary': !!currentProject, 'btn-secondary':!currentProject}">
                    <i class="fal fa-head-vr fa-lg"></i>
                    <label v-if="currentProject">{{currentProject.title}}</label>
                    <label v-else>My Views</label>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item py-2" href="javascript:void(0);" @click="activateProfile(profile)"
                       v-for="profile of this.profiles">{{profile.title}}</a>
                    <div class="dropdown-divider"></div>
                    <div class="input-group px-2" style="min-width: 400px">
                        <input v-model="searchPhrase" class="form-control" @change="search" placeholder="View Title">
                        <div class="input-group-append">
                            <button @click="search" class="btn btn-dark">Save</button>
                        </div>
                    </div>
                </div>
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
                    <button @click="refreshTasks" class="btn btn-success px-5 mt-2">Apply</button>
                </div>
            </div>

            <!--  Coloring -->
            <div class="dropdown">
                <button type="button" class="toolbar-button btn btn-outline-secondary mx-1 px-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fad fa-adjust fa-lg"></i>
                    <label>Coloring</label>
                </button>
                <div class="dropdown-menu">
                    <button :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_Status}" @click="applyColoring(TaskConcern_Status)">Status</button>
                    <button :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_Project}" @click="applyColoring(TaskConcern_Project)">Project</button>
                    <button :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_Priority}" @click="applyColoring(TaskConcern_Priority)">Priority</button>
                    <button :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_Assignee}" @click="applyColoring(TaskConcern_Assignee)">Assignee</button>
                    <button v-if="currentProject" :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_Category}" @click="applyColoring(TaskConcern_Category)">Category</button>
                    <button v-if="currentProject" :class="{'btn btn-link dropdown-item':1,'active':profile.coloring==TaskConcern_MileStone}" @click="applyColoring(TaskConcern_MileStone)">Milestone</button>
                </div>
            </div>

            <div class="flex-grow-1"></div>

            <!--  Search -->
            <div class="search-box border rounded px-1">
                <i class="fal fa-search mx-1"></i>
                <input type="search" v-model="searchPhrase" placeholder="Search task #no / title" class="border-0 outline-0" @change="search">
            </div>

            <!-- Feedback -->
            <div class="dropdown m-1 mt-2" title="Feedback">
                <button id="feedbackButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        type="button" class="btn btn-link">
                    <i class="fal fa-comment-alt-exclamation fa-lg"></i>
                </button>
                <div class="dropdown-menu filter-panel p-3" aria-labelledby="feedbackButton" style="width: 30rem">
                    <form>
                        <div class="mr-2">How much are you satisfied?</div>
                        <div class="my-2">
                            <i class="fal fa-tired pr-2 fa-lg"></i>
                            <i class="fal fa-frown px-2 fa-lg"></i>
                            <i class="fal fa-meh px-2 fa-lg"></i>
                            <i class="fal fa-smile px-2 fa-lg"></i>
                            <i class="fal fa-laugh-beam px-2 fa-lg"></i>
                        </div>
                        <div class="mr-2">Your requests:</div>
                        <textarea placeholder="Comment" class="w-100 p-2"></textarea>
                        <button @click="postFeedback" class="btn btn-success px-4 mt-2">Post</button>
                    </form>
                </div>
            </div>
        </div>

        <!--  Task Details -->
        <div v-if="showTaskDetails" class="task-details container w-100 h-100 p-5">
            <div class="card p-4">
                <div class="d-flex align-items-center mb-3">
                    <h2 class="flex-fill">Task: {{currentTask.title}}</h2>
                    <button class="btn btn-link" @click="showTaskDetails=false"><i class="fal fa-times text-black-50 fa-2x text-right"></i></button>
                </div>
                <details-view @changed="taskChanged" :data="currentTask" :dec="tasksDec" :level="1"></details-view>
                <textarea class="w-100 mt-3">{{currentTask.comment}}</textarea>
            </div>
        </div>

        <!--  Content -->
        <div v-else class="w-100 h-100 overflow-auto d-flex task-manager-content">

            <!--  Calendar -->
            <div class="calendar w-100 h-100 d-flex" v-if="TaskConcern_DueDate===profile.concern">
                <task-group :tasks="unscheduledTasks" v-if="unscheduledTasks.length" title="Unscheduled"
                            class="task-group bg-light px-2 py-1"
                            @startdragtask="dragStart($event.ev,$event.task,null)"
                            @taskmousedown="selectTask($event.task,unscheduledTasks)" @taskkeypress="taskKeypress($event.ev,$event.task,unscheduledTasks)" @clickgroup="clickGroup"
                            @newtask="newTask($event, null)"
                            @dropgroup="drop($event,null)" @dragovergroup="ondragover($event,null)"></task-group>
                <table class="w-100 h-100 flex-fill" @wheel="calendarWheel">
                    <tr v-for="row of calendarRows" class="">
                        <td v-for="day of row.days" :class="day.style" @click="clickGroup">
                            <task-group :tasks="day.tasks" :title="day.day" :subtitle="day.title"
                                        class="task-group h-100 w-100 calendar-day"
                                        @startdragtask="dragStart($event.ev,$event.task,day)" @ondragover="ondragover"
                                        @taskmousedown="selectTask($event.task,day.tasks)" @taskkeypress="taskKeypress($event.ev,$event.task,day.tasks)"
                                        @clickgroup="clickGroup"
                                        @newtask="newTask($event, day)"
                                        @dropgroup="drop($event,day)" @dragovergroup="ondragover($event,day)" :icon="day.icon"></task-group>
                        </td>
                    </tr>
                </table>
            </div>

            <!--  Columns -->
            <task-group v-else v-for="group in taskGroups" :tasks="group.tasks" :title="group.title"
                        class="task-group border-right bg-light px-2 py-1"
                        @startdragtask="dragStart($event.ev,$event.task,group)" @ondragover="ondragover"
                        @taskmousedown="selectTask($event.task,group.tasks)" @taskkeypress="taskKeypress($event.ev,$event.task,group.tasks)" @clickgroup="clickGroup"
                        @newtask="newTask($event, group)"
                        @dropgroup="drop($event,group)" @dragovergroup="ondragover($event,group)" :icon="group.icon"></task-group>

            <div class="flex-grow-1"></div>

            <!--  Task Properties -->
            <div class="task-properties border-left bg-white p-3">
                <div v-if="currentTask">
                    <!--  After Archive Actions -->
                    <div v-if="currentTask.archive" class="mt-5">
                        <button @click="undoArchive(currentTask)" class="btn btn-outline-dark mb-2">Undo Archive</button>
                        <button @click="deleteTask(currentTask)" class="btn btn-outline-danger">Delete Permanently
                        </button>
                    </div>

                    <!--  Task Properties -->
                    <div v-else>
                        <!-- Actions: Archive -->
                        <div class="mb-2">
                            <!--  Task Details -->
                            <button @click="toggleDetails" class="btn btn-link p-0 mx-2" title="Task Details">
                                <i class="fal fa-bars fa-lg"></i>
                            </button>

                            <!--  Archive -->
                            <button @click="archive(currentTask)" class="btn btn-link p-0 mx-2" title="Archive">
                                <i class="fal fa-file-times fa-lg"></i>
                            </button>

                            <!--  Favorite -->
                            <button @click="toggleFavorite" class="btn btn-link p-0 mx-2" title="Favorite">
                                <i :class="{'fa-heart-circle fa-lg':1,'fal':!currentTask.favorite,'fad':currentTask.favorite}"></i>
                            </button>

                            <!--  Sub Task -->
                            <button @click="toggleSubtask(currentTask)" type="button" class="btn btn-link mx-2 p-0" title="Toggle Sub Task">
                                <i :class="{'fal fa-lg':1,'fa-arrow-to-left':currentTask.parent,'fa-arrow-to-right':!currentTask.parent}"></i>
                            </button>

                        </div>
                        <details-view @changed="taskChanged" :data="currentTask" :dec="tasksDec" :level="1"></details-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ID, Keys, ObjectDec, Project, Task, TaskConcern, TaskInboxGroup, TaskManagerProfile, TaskPriority, TaskStatus, WebMethod} from '../../../sys/src/types';
    import TaskGroup from "../components/TaskGroup.vue";
    import {ItemChangeEventArg, MenuItem} from "../types";
    import {ajax, call, equalID, onlyUnique, question, showCmenu} from "../main";

    declare let $, moment: any;

    @Component({name: 'TaskManager', components: {TaskGroup}})
    export default class TaskManager extends Vue {
        private tasks: Task[];
        private profile: TaskManagerProfile = {concern: TaskConcern.Start} as TaskManagerProfile;
        private profiles: TaskManagerProfile[] = [];
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
        private tasksDec: ObjectDec = null;
        private unscheduledTasks: Task[] = [];
        private concernProperty: string;
        private showTaskDetails: boolean = false;
        private TaskConcern_Start = TaskConcern.Start;
        private TaskConcern_Status = TaskConcern.Status;
        private TaskConcern_Project = TaskConcern.Project;
        private TaskConcern_DueDate = TaskConcern.DueDate;
        private TaskConcern_Assignee = TaskConcern.Assignee;
        private TaskConcern_Priority = TaskConcern.Priority;
        private TaskConcern_Category = TaskConcern.Category;
        private TaskConcern_MileStone = TaskConcern.MileStone;
        private searchPhrase = null;
        private currentTask: Task = null;
        private currentGroupTasks: Task[] = null;
        private dragSourceGroup = null;
        private currentProject: Project = null;
        private dragOffset = null;
        private groupItems: { title: string, value: any, icon?: string }[];

        created() {
            call('getTasks', {}, (err, res) => {
                this.tasks = res.data.tasks;
                this.profile = res.data.profile;
                this.tasksDec = res.data.tasksDec;
                this.tasksDec.properties = this.tasksDec.properties.filter(p => ["no", "title", "description", "time", "status", "owner", "priority"].indexOf(p.name) > -1);
                // console.log("this.tasksDec", this.tasksDec);
                this.activateConcern(TaskConcern.Status);
            });
        }

        postFeedback() {

        }

        search() {
            if (!this.searchPhrase) return;
            call("searchTasks", {phrase: this.searchPhrase}, (err, res) => {
                let items = res.data.tasks.map(task => {
                    return {title: task.title, ref: task} as MenuItem;
                });
                showCmenu(null, items, {ctrl: $(".search-box")}, (state, item: MenuItem) => {
                    console.log(item.ref);
                });
            });
        }

        toggleDetails() {
            this.showTaskDetails = !this.showTaskDetails;
        }

        applyColoring(concern: TaskConcern) {
            this.profile.coloring = concern;

            for (let task of this.tasks) {
                this.applyTaskColoring(task);
            }
        }

        applyTaskColoring(task: Task) {
            let index = -1;
            switch (this.profile.coloring) {
                case TaskConcern.Status:
                    index = [TaskStatus.Todo, TaskStatus.Doing, TaskStatus.OnHold, TaskStatus.Verify, TaskStatus.Done].indexOf(task.status);
                    break;

                case TaskConcern.Project:
                    index = this.profile.projects.findIndex(p => equalID(p._id, task.project));
                    break;

                case TaskConcern.Priority:
                    index = [TaskPriority.Normal, TaskPriority.Urgent, TaskPriority.Low, TaskPriority.High].indexOf(task.priority);
                    break;

                case TaskConcern.Assignee:
                    index = this.profile.users.findIndex(user => Array.isArray(task.assignees) && task.assignees.find(a => equalID(a, user._id)));
                    console.log('index', index);
                    break;
            }
            task._.style = index == -1 ? null : "color-" + index;
        }

        taskChanged(e: ItemChangeEventArg) {
            let change = new Task();
            change[e.prop.name] = e.val;
            this.applyTaskColoring(this.currentTask);
            this.saveTask(this.currentTask._id, change, (res) => {
                this.refreshTasks();
            });
        }

        filterProject(project) {
            this.currentProject = project;
            this.refreshTasks();
        }

        calendarWheel(e) {
            this.profile.calendarOffset = this.profile.calendarOffset | 0;
            this.profile.calendarOffset += (e.deltaY > 0 ? 7 : -7);
            this.refreshTasks();
            e.preventDefault();
        }

        toggleFavorite() {
            this.currentTask.favorite = !this.currentTask.favorite;
            this.saveTask(this.currentTask._id, {favorite: this.currentTask.favorite} as Task, (res) => {
                this.refreshTasks();
            });
        }

        archive(task: Task) {
            task.archive = true;
            this.saveTask(task._id, {archive: true} as Task, (res) => {
                this.refreshTasks();
            });
        }

        undoArchive(task: Task) {
            task.archive = false;
            this.saveTask(task._id, {archive: true} as Task, (res) => {
                this.refreshTasks();
            });
        }

        deleteTask(task: Task) {
            ajax(`/tasks/${task._id}`, null, {method: WebMethod.del}, (res) => {
                this.tasks.splice(this.tasks.indexOf(task), 1);
                this.refreshTasks();
            });
            this.currentTask = null;
        }

        getFilterItems(concern: TaskConcern) {
            let items;
            switch (concern) {
                case TaskConcern.Status:
                    items = [];
                    for (let item in TaskStatus) {
                        if (!isNaN(Number(item)))
                            items.push({
                                title: TaskStatus[item],
                                checked: this.profile.filter.statuses == null || this.profile.filter.statuses.indexOf(Number(item)) > -1,
                                value: Number(item)
                            });
                    }
                    break;

                case TaskConcern.Priority:
                    items = [];
                    for (let item in TaskPriority) {
                        if (!isNaN(Number(item)))
                            items.push({
                                title: TaskPriority[item],
                                checked: this.profile.filter.priorities == null || this.profile.filter.priorities.indexOf(Number(item)) > -1,
                                value: Number(item)
                            });
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
                    if (this.profile.filter.statuses == null)
                        this.profile.filter.statuses = [TaskStatus.Todo, TaskStatus.Doing, TaskStatus.Done, TaskStatus.OnHold, TaskStatus.Verify];

                    let index = this.profile.filter.statuses.indexOf(item.value);
                    if ($event.val) {
                        if (index == -1)
                            this.profile.filter.statuses.push(item.value);
                    } else {
                        if (index != -1)
                            this.profile.filter.statuses.splice(index, 1);
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
            let tasks = this.tasks.filter(task => !task.archive);
            if (this.currentProject)
                tasks = tasks.filter(task => task.project && equalID(task.project, this.currentProject._id));
            tasks.forEach(t => t._.multiPlace = false);

            if (this.profile.concern == TaskConcern.DueDate) {
                this.calendarRows = [];
                let firstDay = moment().startOf('month');
                let date = firstDay.add(firstDay.weekday() ? -firstDay.weekday() + 1 : 0, 'days').add(this.profile.calendarOffset || 0, 'days');

                for (let i = 0; i < 6; i++) {
                    let row = {days: []};
                    this.calendarRows.push(row);

                    for (let d = 0; d < 7; d++) {
                        let style = "border align-top ";
                        if (date >= moment().startOf('month') && date < moment().startOf('month').add(1, 'month'))
                            style += "this-month";
                        if (date.format("D MMM") == moment().startOf('day').format("D MMM"))
                            style += " today";

                        if (date.month() % 2 == 1) style += " odd-month";
                        // if (date.date() > date.daysInMonth() - 7) style += " bottom-days";
                        // if (date.date() == date.daysInMonth() && d != 6) style += " last-day-of-month"; // last day of month if not at the end if row

                        let title = (date.date() == 1) ? (date.year() == moment().year() ? date.format("D MMMM") : date.format("D MMMM YYYY")) : date.format("D");
                        if (d == 0 && i == 0)
                            title = date.format("D MMMM");

                        let day = {
                            title,
                            tasks: tasks.filter(task => Array.isArray(task.dueDates) && task.dueDates.find(d => date.diff(moment(d), 'days') == 0)),
                            date: moment(date),
                            style,
                            day: i == 0 ? date.format("ddd") : ""
                        };
                        date = date.add(1, 'days');
                        row.days.push(day);
                    }
                }

                this.unscheduledTasks = tasks.filter(task => (!task.dueDates || !task.dueDates.length) && !task.archive);
                return;
            }

            this.taskGroups = [];
            for (let group of this.groupItems) {

                switch (this.profile.concern) {
                    case TaskConcern.Status:
                        if (this.profile.filter.statuses && this.profile.filter.statuses.indexOf(group.value) == -1)
                            continue;
                }

                let groupTasks = tasks.filter(task => {
                    switch (this.profile.concern) {
                        case TaskConcern.Start:
                            switch (group.value) {
                                case TaskInboxGroup.Favorite:
                                    return !!task.favorite;

                                case TaskInboxGroup.Brainstorm:
                                    return !task.assignees;
                            }

                            // Other tasks must belong to current user
                            if (!Array.isArray(task.assignees) || !task.assignees.find(a => equalID(a, this.profile.currentUser)))
                                return false;

                            let today = moment().startOf('day');
                            switch (group.value) {
                                case TaskInboxGroup.Urgent:
                                    return task.priority == TaskPriority.Urgent;

                                case TaskInboxGroup.Todo:
                                    return task.status == TaskStatus.Todo && task.dueDates && task.dueDates.find(d => today.diff(moment(d), 'days') == 0);

                                case TaskInboxGroup.Doing:
                                    return task.status == TaskStatus.Doing && task.dueDates && task.dueDates.find(d => today.diff(moment(d), 'days') == 0);

                                case TaskInboxGroup.Overdue:
                                    if (task.status == TaskStatus.Done || task.status == TaskStatus.OnHold || !task.dueDates) return false;
                                    return !task.dueDates.find(d => today.diff(moment(d), 'days') < 0);
                            }
                            break;

                        default:
                            if (Array.isArray(task[this.concernProperty])) {
                                for (let item of task[this.concernProperty]) {
                                    if (equalID(item, group.value))
                                        return true;
                                }
                                return false;
                            } else
                                return equalID(task[this.concernProperty], group.value);
                    }
                });

                let parentTasksNeedToInclude = groupTasks.filter(t => t.parent && !groupTasks.find(tsk => equalID(tsk._id, t.parent))).map(t => t.parent);
                for (let task of parentTasksNeedToInclude) {
                    if (groupTasks.find(tsk => equalID(task, tsk._id))) continue;
                    let parentTask = this.tasks.find(tsk => equalID(tsk._id, task));
                    parentTask._.multiPlace = true;
                    groupTasks.unshift(parentTask);
                }
                this.taskGroups.push({title: group.title, tasks: groupTasks, value: group.value, icon: group.icon});
            }
        }

        selectTask(task, tasks) {
            this.currentTask = task;
            this.currentGroupTasks = tasks;
        }

        dragStart(ev, task, group) {
            ev.dataTransfer.setData("text", task._id.toString());
            ev.dataTransfer.effectAllowed = 'all';
            this.dragSourceGroup = group;
        }

        ondragover(ev, group) {
            switch (this.profile.concern) {
                case TaskConcern.Status:
                    ev.dataTransfer.dropEffect = 'none';
                    break;

                case TaskConcern.DueDate:
                    break;

                case TaskConcern.Start:
                    break;

                default:
                    ev.dataTransfer.dropEffect = ev.ctrlKey ? 'copy' : 'none';
                    break;
            }
            // ev.preventDefault();
        }

        dragLeave(e, day) {
            e.preventDefault();
        }

        clickGroup(e) {
            $(e.target).find(".new-task").focus();
        }

        dropToDay(event, day) {
            event.preventDefault();
            if (!this.currentTask.dueDates) this.currentTask.dueDates = [];
            this.currentTask.dueDates.push(day.date.toDate());
            let patch = {} as Task;
            patch.dueDates = this.currentTask.dueDates;
            this.saveTask(this.currentTask._id, patch);
            this.refreshTasks();
            this.currentTask = null;
        }

        drop(event, group) {
            event.preventDefault();
            this.currentTask[this.concernProperty] = group.value;
            this.applyTaskColoring(this.currentTask);
            let patch = {} as Task;
            patch[this.concernProperty] = group.value;
            this.saveTask(this.currentTask._id, patch);
            this.refreshTasks();
            this.currentTask = null;
        }

        saveTask(task: ID, patch: Task, done?) {
            ajax(`/tasks/${task}`, patch, {method: WebMethod.patch}, (res) => {
                console.log("Saved!");
                if (done) done(res);
            });
        }

        taskKeypress(ev, task: Task, tasks: Task[]) {
            this.currentTask = task;
            switch (ev.which) {
                case Keys.del:
                    question("The task will be permanently deleted.", "You won't be able to undo this action.", [
                            {title: "Cancel", ref: "no", _cs: "btn btn-light ml-1"},
                            {title: "Delete task", ref: "yes", _cs: "btn btn-danger ml-1"}],
                        null, (option) => {
                            if (option == "yes") this.deleteTask(task);
                        });
                    break;

                case Keys.ins:
                    this.toggleSubtask(task);
                    break;

                // case Keys.f2:
                //     if (this.taskEditingMode)
                //         this.saveTask(task._id, {title: task.title} as Task);
                //     this.taskEditingMode = !this.taskEditingMode;
                //     break;
            }
        }

        toggleSubtask(task: Task) {
            if (task.parent) {
                task.parent = null
                this.saveTask(task._id, {parent: null} as Task);
            } else {
                let index = this.currentGroupTasks.indexOf(task);
                for (let i = index - 1; i >= 0; i--) {
                    if (!this.currentGroupTasks[i].parent) { // Can be parent
                        task.parent = this.currentGroupTasks[i]._id;
                        this.currentGroupTasks[i]._.children = this.currentGroupTasks[i]._.children || [];
                        this.currentGroupTasks[i]._.children.push(task._id);
                        this.saveTask(task._id, {parent: this.currentGroupTasks[i]._id} as Task);
                        break;
                    }
                }

                if (!task.parent)
                    alert("Can't be subtask.");
            }
            this.refreshTasks();
        }

        activateProfile(profile: TaskManagerProfile) {
            this.activateConcern(profile.concern);
        }

        activateConcern(concern: TaskConcern) {
            this.profile.concern = concern;
            switch (concern) {
                case TaskConcern.Status:
                    this.concernProperty = "status";
                    this.groupItems = [
                        {title: "To Do", value: TaskStatus.Todo},
                        {title: "Doing", value: TaskStatus.Doing},
                        {title: "Verify", value: TaskStatus.Verify},
                        {title: "Done", value: TaskStatus.Done},
                        {title: "On Hold", value: TaskStatus.OnHold}
                    ];
                    break;

                case TaskConcern.Start:
                    this.concernProperty = null;
                    this.groupItems = [
                        {title: "Brainstorm", value: TaskInboxGroup.Brainstorm, icon: 'fad fa-fog fa-lg'},
                        {title: "To Do (Today)", value: TaskInboxGroup.Todo},
                        {title: "Doing (Today)", value: TaskInboxGroup.Doing},
                        {title: "Urgent", value: TaskInboxGroup.Urgent},
                        {title: "Overdue", value: TaskInboxGroup.Overdue},
                        {title: "Favorite", value: TaskInboxGroup.Favorite, icon: 'fal fa-heart mr-1'},
                    ];
                    break;

                case TaskConcern.DueDate:
                    this.concernProperty = "dueDates";
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
                let task = {
                    title: e.target.value,
                    _id: ID.generateByBrowser(),
                    status: TaskStatus.Todo,
                    project: this.currentProject ? this.currentProject._id : null,
                    priority: TaskPriority.Normal,
                    _: {}
                } as Task;
                task["_new"] = true;

                switch (this.profile.concern) {
                    case TaskConcern.Assignee:
                        task[this.concernProperty] = group.value;
                        break;

                    case TaskConcern.DueDate:
                        if (group) {
                            task.dueDates = task.dueDates || [];
                            task.dueDates.push(group.date.toDate());
                        }
                        break;

                    case TaskConcern.Category:
                        task[this.concernProperty] = group.value;
                        break;

                    case TaskConcern.MileStone:
                        task[this.concernProperty] = group.value;
                        break;

                    case TaskConcern.Priority:
                        task[this.concernProperty] = group.value;
                        break;

                    case TaskConcern.Start:
                        task[this.concernProperty] = group.value;
                        break;

                    case TaskConcern.Status:
                        task[this.concernProperty] = group.value;
                        break;
                }
                this.tasks.push(task);
                this.applyTaskColoring(task);
                this.refreshTasks();
                e.target.value = "";
                ajax(`/tasks`, task, {method: WebMethod.post}, (res) => {
                    Object.assign(task, res.modifyResult);
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

        .task-group {
            width: 15rem;

            &.drag-over {
                background-color: rgba(0, 140, 255, 0.05) !important;
            }
        }

        .toolbar-button {
            min-width: 3.5rem;
            margin-bottom: .2rem;
            padding: 0.375rem 0.5rem;

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
            width: 20rem;
            font-size: .8rem;
        }

        .new-task {
            outline: none;
            font-size: .8rem;
        }

        .task-item {
            font-size: .8rem;
            cursor: default;
            background-color: white;
            min-width: 5rem;

            &.hover {
                background-color: gray !important;
            }

            input {
                background-color: transparent;
                cursor: default;
                color: inherit;
            }

            &.subitem-task {
                padding-left: 1rem !important;
            }

            &.subitem-task:before {
                content: 'X';
            }

            &.multi-place {
                border-style: dashed !important;
            }
        }

        .color- {
            &0 {
                color: white;
                background-color: #0083d9;
            }

            &1 {
                color: white;
                background-color: #ff6a00;
            }

            &2 {
                color: white;
                background-color: #aaa;
            }

            &3 {
                color: #905000;
                background-color: orange;
            }

            &4 {
                color: white;
                background-color: green;
            }

            &5 {
                color: white;
                background-color: #0083d9;
            }

            &6 {
                color: white;
                background-color: #ff6a00;
            }

            &7 {
                color: white;
                background-color: #aaa;
            }

            &8 {
                color: white;
                background-color: orange;
            }

            &9 {
                color: white;
                background-color: green;
            }
        }

        .details-view {
            .prop-label {
                width: 5rem;
            }

            .prop-value {
                width: 10rem;
            }

            .form-group {
                width: 15rem;
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

        .concerns {
            .active {
                background-color: var(--mina-blue) !important;
            }
        }

        .calendar {
            table {
                table-layout: fixed;
            }

            label {
                color: gray;
            }

            td.odd-month {
                background-color: #f8f9fa;
            }

            .calendar-day {
                padding: 0 .2rem;
                overflow: auto;
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
        }
    }
</style>
