"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_property_decorator_1 = require("vue-property-decorator");
const types_1 = require("../../../sys/src/types");
const main_1 = require("@/main");
const CheckBox_vue_1 = tslib_1.__importDefault(require("@/components/CheckBox.vue"));
const PropTime_vue_1 = tslib_1.__importDefault(require("@/components/PropTime.vue"));
let TaskManager = /** @class */ (() => {
    let TaskManager = class TaskManager extends vue_property_decorator_1.Vue {
        constructor() {
            super(...arguments);
            this.profile = {};
            this.taskGroups = [];
            this.TaskConcern_Status = types_1.TaskConcern.Status;
            this.TaskConcern_DueDate = types_1.TaskConcern.DueDate;
            this.TaskConcern_Assignee = types_1.TaskConcern.Assignee;
            this.TaskConcern_Category = types_1.TaskConcern.Category;
            this.TaskConcern_Project = types_1.TaskConcern.Project;
            this.TaskConcern_MileStone = types_1.TaskConcern.MileStone;
            this.TaskConcern_Priority = types_1.TaskConcern.Priority;
            this.currentTask = null;
            this.currentProject = null;
            this.taskEditingMode = false;
            this.dragOffset = null;
            this.taskConcern = types_1.TaskConcern.Status;
        }
        created() {
            main_1.call('getTasks', {}, (err, res) => {
                this.tasks = res.data.tasks;
                this.profile = res.data.profile;
                this.activateConcern(types_1.TaskConcern.Status);
            });
        }
        getFilterItems(concern) {
            let items;
            switch (concern) {
                case types_1.TaskConcern.Status:
                    items = [{ title: 'All', checked: this.profile.filter.statuses == null, value: null }];
                    if (this.profile.filter.statuses) {
                        for (let item in types_1.TaskStatus) {
                            if (!isNaN(Number(item)))
                                items.push({ title: types_1.TaskStatus[item], checked: this.profile.filter.statuses.indexOf(Number(item)) > -1, value: Number(item) });
                        }
                    }
                    break;
                case types_1.TaskConcern.Priority:
                    items = [{ title: 'All', checked: this.profile.filter.priorities == null, value: null }];
                    if (this.profile.filter.priorities) {
                        for (let item in types_1.TaskPriority) {
                            if (!isNaN(Number(item)))
                                items.push({ title: types_1.TaskPriority[item], checked: this.profile.filter.priorities.indexOf(Number(item)) > -1, value: Number(item) });
                        }
                    }
                    break;
                case types_1.TaskConcern.Assignee:
                    items = [{ title: 'All', checked: this.profile.filter.assignees == null, value: null }];
                    if (this.profile.filter.assignees) {
                        for (let user of this.profile.users) {
                            items.push({ title: user.title, checked: this.profile.filter.assignees.indexOf(user._id) > -1, value: user._id });
                        }
                    }
                    break;
                case types_1.TaskConcern.Project:
                    items = [{ title: 'All', checked: this.profile.filter.projects == null, value: null }];
                    if (this.profile.filter.projects) {
                        for (let project of this.profile.projects) {
                            items.push({ title: project.title, checked: this.profile.filter.projects.indexOf(project._id) > -1, value: project._id });
                        }
                    }
                    break;
                case types_1.TaskConcern.MileStone:
                    items = [{ title: 'All', checked: this.profile.filter.milestones == null, value: null }];
                    if (this.profile.filter.milestones) {
                        for (let milestone of this.currentProject.milestones) {
                            items.push({ title: milestone.title, checked: this.profile.filter.milestones.indexOf(milestone._id) > -1, value: milestone._id });
                        }
                    }
                    break;
                case types_1.TaskConcern.Category:
                    items = [{ title: 'All', checked: this.profile.filter.categories == null, value: null }];
                    if (this.profile.filter.categories) {
                        for (let category of this.currentProject.categories) {
                            items.push({ title: category, checked: this.profile.filter.categories.indexOf(category) > -1, value: category });
                        }
                    }
                    break;
            }
            return items;
        }
        filterItemCheckChanged($event, item, concern) {
            switch (concern) {
                case types_1.TaskConcern.Status:
                    if (item.value == null) // All
                        this.profile.filter.statuses = $event.val ? null : [types_1.TaskStatus.Todo, types_1.TaskStatus.Doing, types_1.TaskStatus.Done, types_1.TaskStatus.OnHold, types_1.TaskStatus.Verify];
                    else {
                        let index = this.profile.filter.statuses.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.statuses.push(item.value);
                        }
                        else {
                            if (index != -1)
                                this.profile.filter.statuses.splice(index, 1);
                        }
                    }
                    break;
                case types_1.TaskConcern.Priority:
                    if (item.value == null) // All
                        this.profile.filter.priorities = $event.val ? null : [types_1.TaskPriority.Low, types_1.TaskPriority.Normal, types_1.TaskPriority.High, types_1.TaskPriority.Urgent];
                    else {
                        let index = this.profile.filter.priorities.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.priorities.push(item.value);
                        }
                        else {
                            if (index != -1)
                                this.profile.filter.priorities.splice(index, 1);
                        }
                    }
                    break;
                case types_1.TaskConcern.Assignee:
                    if (item.value == null) // All
                        this.profile.filter.assignees = $event.val ? null : this.profile.users.map(u => u._id);
                    else {
                        let index = this.profile.filter.assignees.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.assignees.push(item.value);
                        }
                        else {
                            if (index != -1)
                                this.profile.filter.assignees.splice(index, 1);
                        }
                    }
                    break;
                case types_1.TaskConcern.Project:
                    if (item.value == null) // All
                        this.profile.filter.projects = $event.val ? null : this.profile.projects.map(u => u._id);
                    else {
                        let index = this.profile.filter.projects.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.projects.push(item.value);
                        }
                        else {
                            if (index != -1)
                                this.profile.filter.projects.splice(index, 1);
                        }
                    }
                    // Specify CurrentProject
                    if (this.profile.projects.length == 1)
                        this.currentProject = this.profile.projects.find(p => main_1.equalID(p._id, this.profile.projects[0]));
                    else if (this.profile.filter.projects && this.profile.filter.projects.length == 1)
                        this.currentProject = this.profile.projects.find(p => main_1.equalID(p._id, this.profile.filter.projects[0]));
                    else
                        this.currentProject = null;
                    break;
                case types_1.TaskConcern.MileStone:
                    if (item.value == null) // All
                        this.profile.filter.milestones = $event.val ? null : this.currentProject.milestones.map(u => u._id);
                    else {
                        let index = this.profile.filter.milestones.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.milestones.push(item.value);
                        }
                        else {
                            if (index != -1)
                                this.profile.filter.milestones.splice(index, 1);
                        }
                    }
                    break;
                case types_1.TaskConcern.Category:
                    if (item.value == null) // All
                        this.profile.filter.categories = $event.val ? null : this.currentProject.categories;
                    else {
                        let index = this.profile.filter.categories.indexOf(item.value);
                        if ($event.val) {
                            if (index == -1)
                                this.profile.filter.categories.push(item.value);
                        }
                        else {
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
                            if (main_1.equalID(item, group.value))
                                return true;
                        }
                        return false;
                    }
                    else
                        return main_1.equalID(task[this.concernProperty], group.value);
                });
                this.taskGroups.push({ title: group.title, tasks, value: group.value });
            }
            let allValues = this.groupItems.map(e => e.value);
            this.taskGroups.unshift({ icon: 'fad fa-fog fa-lg', title: 'Brainstorm', value: null, tasks: this.tasks.filter(task => task[this.concernProperty] == null || allValues.indexOf(task[this.concernProperty]) == -1) });
        }
        dragStart(event, task) {
            event.dataTransfer.setData("Text", task._id);
            event.dataTransfer.effectAllowed = 'move';
            this.currentTask = task;
        }
        dragging(event) {
            // console.log(event.x, event.y);
        }
        allowDrop(event, group) {
            event.preventDefault();
        }
        clickGroup($event, group) {
            $($event.target).find(".new-task").focus();
        }
        drop(event, group) {
            event.preventDefault();
            this.currentTask[this.concernProperty] = group.value;
            let patch = {};
            patch[this.concernProperty] = group.value;
            this.saveTask(this.currentTask._id, patch);
            this.refreshTasks();
            this.currentTask = null;
        }
        saveTask(task, patch) {
            main_1.ajax(`/tasks/${task}`, patch, { method: types_1.WebMethod.patch }, (res) => {
                console.log("Saved!");
            });
        }
        taskKeypress(e, task) {
            this.currentTask = task;
            switch (e.which) {
                case types_1.Keys.del:
                    if (this.taskEditingMode)
                        return;
                    main_1.question("Delete confirm", "Are you sure to delete this task?", [{ title: "YES", ref: "yes" }, { title: "NO", ref: "no", _cs: "btn btn-dark" }], null, (option) => {
                        if (option == "yes") {
                            main_1.ajax(`/tasks/${task._id}`, null, { method: types_1.WebMethod.del }, (res) => {
                                this.tasks.splice(this.tasks.indexOf(task), 1);
                                this.refreshTasks();
                            });
                        }
                    });
                    break;
                case types_1.Keys.enter:
                    if (this.taskEditingMode)
                        this.saveTask(task._id, { title: task.title });
                    this.taskEditingMode = !this.taskEditingMode;
                    break;
            }
        }
        activateConcern(taskConcern) {
            this.taskConcern = taskConcern;
            switch (taskConcern) {
                case types_1.TaskConcern.Status:
                    this.concernProperty = "status";
                    this.groupItems = [
                        { title: "Todo", value: 1 },
                        { title: "Doing", value: 2 },
                        { title: "Done", value: 3 },
                        { title: "On Hold", value: 4 }
                    ];
                    break;
                case types_1.TaskConcern.Priority:
                    this.concernProperty = "priority";
                    this.groupItems = [
                        { title: types_1.TaskPriority[types_1.TaskPriority.Urgent], value: types_1.TaskPriority.Urgent },
                        { title: types_1.TaskPriority[types_1.TaskPriority.High], value: types_1.TaskPriority.High },
                        { title: types_1.TaskPriority[types_1.TaskPriority.Normal], value: types_1.TaskPriority.Normal },
                        { title: types_1.TaskPriority[types_1.TaskPriority.Low], value: types_1.TaskPriority.Low }
                    ];
                    break;
                case types_1.TaskConcern.Date:
                    this.concernProperty = "dueDates";
                    this.groupItems = [
                        { title: "27 Jun", value: 1 },
                        { title: "28 Jun", value: 2 },
                        { title: "29 Jun", value: 3 },
                        { title: "30 Jun", value: 4 },
                        { title: "1 July", value: 5 },
                        { title: "2 July", value: 6 },
                        { title: "3 July", value: 7 }
                    ];
                    break;
                case types_1.TaskConcern.Assignee:
                    this.concernProperty = "assignees";
                    this.groupItems = this.profile.users.map(user => {
                        return { title: user.title, value: user._id };
                    });
                    break;
                case types_1.TaskConcern.Project:
                    this.concernProperty = "project";
                    this.groupItems = this.profile.projects.map(project => {
                        return { title: project.title, value: project._id };
                    });
                    break;
            }
            this.refreshTasks();
        }
        newTask(e, group) {
            if (e.target.value) {
                let task = { title: e.target.value, _id: types_1.ID.generateByBrowser() };
                task["_new"] = true;
                task[this.concernProperty] = group.value;
                this.tasks.push(task);
                this.refreshTasks();
                e.target.value = "";
                main_1.ajax(`/tasks`, task, { method: types_1.WebMethod.post }, (res) => {
                    console.log("Saved!");
                });
            }
        }
    };
    TaskManager = tslib_1.__decorate([
        vue_property_decorator_1.Component({
            name: 'TaskManager',
            components: { PropTime: PropTime_vue_1.default, CheckBox: CheckBox_vue_1.default }
        })
    ], TaskManager);
    return TaskManager;
})();
exports.default = TaskManager;
//# sourceMappingURL=TaskManager.vue.js.map