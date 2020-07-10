<template>
    <div class="task-manager h-100 d-flex flex-column flex-fill overflow-auto">
        <!--  Toolbar -->
        <div class="d-flex p-2 align-items-center toolbar" role="toolbar">

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
                    <div class="flex-fill">
                        <h2>#{{currentTask.no}}</h2>
                        <h3>{{currentTask.title}}</h3>
                    </div>
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
                <task-group v-if="unscheduledTasksGroup && unscheduledTasksGroup.tasks.length"
                            :group="unscheduledTasksGroup" class="bg-light px-2 py-1" @newtask="newTask($event, null)"
                            @startdragtask="dragStart($event.ev,$event.task,null)"
                            @taskmousedown="selectTask($event.task,unscheduledTasksGroup)" @taskkeypress="taskKeypress($event.ev,$event.task,unscheduledTasksGroup)" @clickgroup="clickGroup"
                            @drop="drop($event,null)" @dragovergroup="ondragover($event,null)"></task-group>
                <table class="w-100 h-100 flex-fill" @wheel="calendarWheel">
                    <tr v-for="row of calendarRows" class="">
                        <td v-for="day of row.days" :class="day.style" @click="clickGroup($event,day)">
                            <task-group class="h-100 w-100 calendar-day" :group="day"
                                        @startdragtask="dragStart($event.ev,$event.task,day)" @ondragover="ondragover"
                                        @taskmousedown="selectTask($event.task,day)" @taskkeypress="taskKeypress($event.ev,$event.task,day)"
                                        @clickgroup="clickGroup" @newtask="newTask($event, day)"
                                        @drop="drop($event,day)" @dragovergroup="ondragover($event,day)"></task-group>
                        </td>
                    </tr>
                </table>
            </div>

            <!--  Columns -->
            <task-group v-else v-for="group in taskGroups"
                        class="border-right bg-light px-2 py-1" :group="group"
                        @startdragtask="dragStart($event.ev,$event.task,group)" @ondragover="ondragover"
                        @taskmousedown="selectTask($event.task,group)" @taskkeypress="taskKeypress($event.ev,$event.task,group)" @clickgroup="clickGroup"
                        @newtask="newTask($event, group)"
                        @drop="drop($event,group)" @dragovergroup="ondragover($event,group)"></task-group>

            <div class="flex-grow-1"></div>

            <!--  Right Panel -->
            <div class="right-panel border-left bg-white p-3">
                <div class="coloring-legend details-view border-bottom pb-3 mb-2">
                    <div class="d-flex align-items-center">
                        <label class="prop-label px-1">Coloring</label>
                        <select class="prop-value flex-fill border bg-white m-1" @change="applyColoring">
                            <option></option>
                            <option value="2">Status</option>
                            <option value="4">Assignee</option>
                            <option value="5">Priority</option>
                            <option value="6">Project</option>
                            <option v-if="this.currentProject" value="8">Category</option>
                            <option v-if="this.currentProject" value="9">MileStone</option>
                        </select>
                    </div>

                    <div class="row px-3" v-if="profile.coloring">
                        <div class="col-6 legend-item p-1" v-for="(item,i) of coloringLegend">
                            <div :class="`py-1 px-2 color-${i}`">{{item.title}}</div>
                        </div>
                    </div>
                </div>
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
                <div v-else>Select a task to see its details here.</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ID, Keys, ObjectDec, Pair, Project, Task, TaskConcern, TaskInboxGroup, TaskManagerProfile, TaskPriority, TaskStatus, WebMethod} from '../../../sys/src/types';
    import TaskGroup from "../components/TaskGroup.vue";
    import {ItemChangeEventArg, MenuItem, TaskGroupData} from "../types";
    import {ajax, call, equalID, markDown, question, showCmenu} from "../main";

    declare let $, moment: any;

    @Component({name: 'TaskManager', components: {TaskGroup}})
    export default class TaskManager extends Vue {
        private tasks: Task[] = [];
        private profile: TaskManagerProfile = {concern: TaskConcern.Start} as TaskManagerProfile;
        private coloringLegend: Pair[] = [];
        private profiles: TaskManagerProfile[] = [];
        private taskGroups: TaskGroupData[] = [];
        private calendarRows: {
            days: TaskGroupData[]
        }[] = [];
        private tasksDec: ObjectDec = null;
        private unscheduledTasksGroup: TaskGroupData = null;
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
        private sourceGroup: TaskGroupData = null;
        private currentProject: Project = null;
        private dragOffset = null;
        private groupItems: { title: string, value: any, icon?: string }[];

        created() {
            call('getTasks', {}, (err, res) => {
                this.tasks = res.data.tasks;
                this.profile = res.data.profile;
                this.tasksDec = res.data.tasksDec;
                this.tasksDec.properties = this.tasksDec.properties.filter(p => ["no", "title", "project", "description", "time", "status", "owner", "priority"].indexOf(p.name) > -1);
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

        applyColoring(ev) {
            this.profile.coloring = ev.target.value ? parseInt(ev.target.value) : null;

            for (let task of this.tasks) {
                this.applyTaskColoring(task);
            }

            this.coloringLegend = this.getConcernItems(this.profile.coloring);
        }

        getConcernItems(concern: TaskConcern): Pair[] {
            switch (concern) {
                case TaskConcern.Status:
                    return [
                        {title: "To Do", ref: TaskStatus.Todo},
                        {title: "Doing", ref: TaskStatus.Doing},
                        {title: "Verify", ref: TaskStatus.Verify},
                        {title: "Done", ref: TaskStatus.Done},
                        {title: "On Hold", ref: TaskStatus.OnHold}
                    ];

                case TaskConcern.Project:
                    return this.profile.projects.map(project => {
                        return {title: project.title, ref: project._id} as Pair;
                    });

                case TaskConcern.Priority:
                    return [
                        {title: "Normal", ref: TaskPriority.Normal},
                        {title: "Urgent", ref: TaskPriority.Urgent},
                        {title: "Low", ref: TaskPriority.Low},
                        {title: "High", ref: TaskPriority.High}
                    ];

                case TaskConcern.Assignee:
                    return this.profile.users.map(user => {
                        return {title: user.title, ref: user._id} as Pair;
                    });

                case TaskConcern.MileStone:
                    return this.currentProject.milestones.map(item => {
                        return {title: item.title, ref: item._id} as Pair;
                    });

                case TaskConcern.Category:
                    return this.currentProject.categories.map(item => {
                        return {title: item, ref: item} as Pair;
                    });
            }
        }

        applyTaskColoring(task: Task) {
            let items = this.getConcernItems(this.profile.coloring);
            let index = -1;

            switch (this.profile.coloring) {
                case TaskConcern.Status:
                    index = items.findIndex(item => item.ref == task.status);
                    break;

                case TaskConcern.Project:
                    index = items.findIndex(item => equalID(item.ref, task.project));
                    break;

                case TaskConcern.MileStone:
                    index = items.findIndex(item => equalID(item.ref, task.milestone));
                    break;

                case TaskConcern.Category:
                    index = items.findIndex(item => task.categories && task.categories.indexOf(item.ref) > -1);
                    break;

                case TaskConcern.Priority:
                    index = items.findIndex(item => item.ref == task.priority);
                    break;

                case TaskConcern.Assignee:
                    index = this.profile.users.findIndex(user => Array.isArray(task.assignees) && task.assignees.find(a => equalID(a, user._id)));
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

        sortTasks(tasks: Task[]): Task[] {
            let maxZ = Math.max(...tasks.map(t => t._z)) | 0;
            tasks.filter(t => !t._z).forEach(task => {
                task._z = ++maxZ;
                task._.dirty = true;
            });
            tasks.sort((t1, t2) => t1._z - t2._z);

            for (let i = 1; i < tasks.length; i++) { // Check if there is an issue in orders
                if (tasks[i]._z <= tasks[i - 1]._z) {
                    tasks[i]._z = tasks[i - 1]._z + 1;
                    tasks[i]._.dirty = true;
                }
            }

            for (let task of tasks.filter(t => t._.dirty)) {
                this.saveTask(task._id, {_z: task._z} as Task);
            }

            return tasks;
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

                        let subtitle = (date.date() == 1) ? (date.year() == moment().year() ? date.format("D MMMM") : date.format("D MMMM YYYY")) : date.format("D");
                        if (d == 0 && i == 0)
                            subtitle = date.format("D MMMM");

                        let day = {
                            concern: TaskConcern.DueDate,
                            subtitle,
                            tasks: this.sortTasks(tasks.filter(task => task.dueDates &&
                                task.dueDates.find(d => this.datePeriodContains(d.time, moment(date))))),
                            value: moment(date),
                            style,
                            title: i == 0 ? date.format("ddd") : ""
                        } as TaskGroupData;
                        date = date.add(1, 'days');
                        row.days.push(day);
                    }
                }

                this.unscheduledTasksGroup = {tasks: tasks.filter(task => (!task.dueDates || !task.dueDates.length) && !task.archive), title: "Unscheduled"} as TaskGroupData;
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
                            if (!task.assignees || !task.assignees.find(a => equalID(a, this.profile.currentUser)))
                                return false;

                            let today = moment().startOf('day');
                            console.log(today.toDate().toUTCString());
                            switch (group.value) {
                                case TaskInboxGroup.Urgent:
                                    return task.priority == TaskPriority.Urgent;

                                case TaskInboxGroup.Todo:
                                    return task.status == TaskStatus.Todo && task.dueDates &&
                                        task.dueDates.find(d => this.datePeriodContains(d.time, today));

                                case TaskInboxGroup.Doing:
                                    return task.status == TaskStatus.Doing && task.dueDates &&
                                        task.dueDates.find(d => this.datePeriodContains(d.time, today));

                                case TaskInboxGroup.Overdue:
                                    if (task.status == TaskStatus.Done || task.status == TaskStatus.OnHold || !task.dueDates) return false;
                                    return task.dueDates.find(d => moment(d.time).diff(today) < 0);
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

                let groupData = {
                    title: group.title,
                    tasks: this.sortTasks(groupTasks),
                    value: group.value,
                    icon: group.icon,
                    concern: this.profile.concern
                } as TaskGroupData;

                if (this.profile.concern == TaskConcern.MileStone && group.value) {
                    groupData.subtitle = markDown(this.currentProject.milestones.find(m => equalID(m._id, group.value)).objectives);
                }

                this.taskGroups.push(groupData);
            }
        }

        selectTask(task, group) {
            this.currentTask = task;
            this.sourceGroup = group;
        }

        dragStart(ev, task: Task, group: TaskGroupData) {
            ev.dataTransfer.setData("text", task._id.toString());
            ev.dataTransfer.effectAllowed = 'all';
            this.sourceGroup = group;
        }

        dragLeave(e, day) {
            e.preventDefault();
        }

        clickGroup(ev, group) {
            $(ev.target).find(".new-task").focus();
        }

        datePeriodContains(time: Date, date: any) {
            return date.diff(time) <= 0 && date.add(1, 'days').diff(time) > 0;
        }

        ondragover(ev, group) {
            switch (this.profile.concern) {
                case TaskConcern.Status:
                    ev.dataTransfer.dropEffect = 'move';
                    break;

                case TaskConcern.DueDate:
                    ev.dataTransfer.dropEffect = ev.ctrlKey ? 'copy' : 'move';
                    break;

                case TaskConcern.Start:
                    break;

                default:
                    ev.dataTransfer.dropEffect = ev.ctrlKey ? 'copy' : 'move';
                    break;
            }
        }

        drop(ev, group) {
            ev.preventDefault();
            this.currentTask._z = (Math.max(...group.tasks.map(t => t._z)) | 0) + 1;
            let patch = {_z: this.currentTask._z} as Task;
            switch (this.profile.concern) {
                case TaskConcern.DueDate: {
                    this.currentTask.dueDates = this.currentTask.dueDates || [];
                    let indexInSource = this.currentTask.dueDates.findIndex(d => this.sourceGroup.value.diff(d.time) == 0);
                    if (!ev.ctrlKey) {
                        if (indexInSource > -1) this.currentTask.dueDates.splice(indexInSource, 1);
                    }

                    let indexOnTarget = this.currentTask.dueDates.findIndex(d => group.value.diff(d.time) == 0);
                    if (indexOnTarget == -1) // Check if it does not already exists
                        this.currentTask.dueDates.push({_id: ID.generateByBrowser(), time: group.value.toDate()});
                }
                    break;

                case TaskConcern.Category:
                    if (!group.value) {
                        this.currentTask.categories = null;
                    } else {
                        this.currentTask.categories = this.currentTask.categories || [];
                        let indexInSource = this.currentTask.categories.indexOf(this.sourceGroup.value);
                        if (!ev.ctrlKey) {
                            if (indexInSource > -1) this.currentTask.categories.splice(indexInSource, 1);
                        }

                        let indexOnTarget = this.currentTask.categories.indexOf(group.value);
                        if (indexOnTarget == -1) // Check if it does not already exists
                            this.currentTask.categories.push(group.value);
                    }
                    break;

                case TaskConcern.Assignee:
                    if (!group.value) {
                        this.currentTask.assignees = null;
                    } else {
                        this.currentTask.assignees = this.currentTask.assignees || [];
                        let indexInSource = this.currentTask.assignees.findIndex(d => equalID(d, this.sourceGroup.value));
                        if (!ev.ctrlKey) {
                            if (indexInSource > -1) this.currentTask.assignees.splice(indexInSource, 1);
                        }

                        let indexOnTarget = this.currentTask.assignees.findIndex(d => equalID(d, group.value));
                        if (indexOnTarget == -1) // Check if it does not already exists
                            this.currentTask.assignees.push(group.value);
                    }
                    break;

                default:
                    this.currentTask[this.concernProperty] = group.value;
                    break;
            }
            this.applyTaskColoring(this.currentTask);
            patch[this.concernProperty] = this.currentTask[this.concernProperty];
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

        taskKeypress(ev, task: Task, group: TaskGroupData) {
            this.currentTask = task;
            switch (ev.which) {
                case Keys.del:
                    switch (this.profile.concern) {
                        case TaskConcern.DueDate:
                            if (task.dueDates && task.dueDates.length > 1) {
                                let indexOnTarget = task.dueDates.findIndex(d => this.datePeriodContains(d.time, group.value));
                                this.currentTask.dueDates.splice(indexOnTarget, 1);
                                this.saveTask(this.currentTask._id, {dueDates: this.currentTask.dueDates} as Task);
                                this.refreshTasks();
                                return;
                            }
                            break;

                        case TaskConcern.Assignee:
                            if (task.assignees && task.assignees.length > 1) {
                                let indexOnTarget = task.assignees.findIndex(d => equalID(d, group.value));
                                this.currentTask.assignees.splice(indexOnTarget, 1);
                                this.saveTask(this.currentTask._id, {assignees: this.currentTask.assignees} as Task);
                                this.refreshTasks();
                                return;
                            }
                            break;
                    }
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
                let index = this.sourceGroup.tasks.indexOf(task);
                for (let i = index - 1; i >= 0; i--) {
                    if (!this.sourceGroup.tasks[i].parent) { // Can be parent
                        task.parent = this.sourceGroup.tasks[i]._id;
                        this.sourceGroup.tasks[i]._.children = this.sourceGroup.tasks[i]._.children || [];
                        this.sourceGroup.tasks[i]._.children.push(task._id);
                        this.saveTask(task._id, {parent: this.sourceGroup.tasks[i]._id} as Task);
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
                    this.groupItems.unshift({title: "[Unplanned]", value: null});
                    break;

                case TaskConcern.Category:
                    this.concernProperty = "categories";
                    this.groupItems = this.currentProject.categories.map(category => {
                        return {title: category, value: category}
                    });
                    this.groupItems.unshift({title: "[Uncategorized]", value: null});
                    break;
            }
            this.refreshTasks();
        }

        newTask(e, group: TaskGroupData) {
            if (e.target.value) {
                let task = {
                    title: e.target.value,
                    _id: ID.generateByBrowser(),
                    status: TaskStatus.Todo,
                    project: this.currentProject ? this.currentProject._id : null,
                    priority: TaskPriority.Normal,
                    _z: (Math.max(...group.tasks.map(t => t._z)) | 0) + 1,
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
                            task.dueDates.push({_id: ID.generateByBrowser(), time: group.value.toDate()});
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

        .right-panel {
            width: 22rem;
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

        .right-panel .details-view {
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

        .draging-rotate {
            transform: rotate(5deg);
        }

        select option {
            font-size: 1rem;
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
