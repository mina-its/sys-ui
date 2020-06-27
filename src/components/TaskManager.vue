<template>
    <div class="task-manager h-100 d-flex flex-column flex-fill overflow-auto">
        <!--  Toolbar -->
        <div class="d-flex p-2 align-items-center btn-toolbar separator-line toolbar" role="toolbar">
            <span class="mr-2">Concern:</span>
            <div class="btn-group mr-2" role="group" aria-label="First group">
                <button data-toggle="tooltip" title="Status" @click="activateConcern(TaskConcern_Status)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_Status===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-ballot-check fa-lg"></i></a></button>
                <button data-toggle="tooltip" title="Calendar" @click="activateConcern(TaskConcern_Date)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_Date===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-calendar-alt fa-lg"></i></a></button>
                <button data-toggle="tooltip" title="Assignee" @click="activateConcern(TaskConcern_Team)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_Team===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-users fa-lg"></i></a></button>
                <button data-toggle="tooltip" title="Project" @click="activateConcern(TaskConcern_Project)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_Project===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-construction fa-lg"></i></a>
                </button>
                <button data-toggle="tooltip" title="MileStone" @click="activateConcern(TaskConcern_MileStone)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_MileStone===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-pennant fa-lg"></i></a>
                </button>
                <button data-toggle="tooltip" title="Category" @click="activateConcern(TaskConcern_Subject)" type="button" :class="{'btn btn-secondary':1,'active':TaskConcern_Subject===taskConcern}"><a class="text-white" href="javascript:void(0);"><i class="fal fa-layer-group fa-lg"></i></a>
                </button>
            </div>
            <button data-toggle="tooltip" title="Coloring" type="button" class="btn btn-outline-secondary mx-1"><i class="fal fa-adjust px-2 fa-lg"></i></button>
            <button data-toggle="tooltip" title="Filter" type="button" class="btn btn-outline-secondary mx-1"><i class="fal fa-filter px-2 fa-lg"></i></button>
            <button data-toggle="tooltip" title="Profile" type="button" class="btn btn-outline-secondary mx-1"><i class="fal fa-head-vr px-2 fa-lg"></i></button>
            <button data-toggle="tooltip" title="Level 1 -> 2" type="button" class="btn btn-outline-secondary mx-1"><i class="fal fa-arrow-square-right px-2 fa-lg"></i></button>
            <button data-toggle="tooltip" title="Settings" type="button" class="btn btn-outline-secondary mx-1"><i class="fal fa-cog px-2 fa-lg"></i></button>
        </div>

        <!--  Content -->
        <div class="w-100 h-100 overflow-auto d-flex">
            <div v-for="group in taskGroups" @drop="drop($event,group)" @dragover="allowDrop($event,group)" class="task-manager-group border bg-light p-2">
                <div class="font-weight-bold">{{group.title}}</div>
                <div class="tasks-panel">
                    <div draggable="true" @dragstart="dragStart($event,task)" @drag="dragging" v-for="task in group.tasks" class="task-manager-box mt-1 wrap border rounded">
                        <input v-focus v-model="task.title" class="px-1 border-0 w-100"/>
                    </div>
                </div>
                <button @click="newTask" class="btn text-center w-100 mt-2"><i class="fa fa-plus p-1"></i></button>
            </div>
        </div>

        <div class="moving-box"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {TaskConcern} from '@/types';
    import {Task} from '../../../sys/src/types';
    import {call} from '@/main';

    declare let $: any;

    @Component({name: 'TaskManager'})
    export default class TaskManager extends Vue {
        private tasks: Task[];
        private taskGroups: { title: string, tasks: Task[] }[] = [];
        private TaskConcern_Status = TaskConcern.Status;
        private TaskConcern_Date = TaskConcern.Date;
        private TaskConcern_Team = TaskConcern.Team;
        private TaskConcern_Subject = TaskConcern.Subject;
        private TaskConcern_Project = TaskConcern.Project;
        private TaskConcern_MileStone = TaskConcern.MileStone;
        private draggedTask: Task;
        private dragOffset = null;
        private taskConcern: TaskConcern = TaskConcern.Status;

        created() {
            call('getTasks', {}, (err, res) => {
                this.tasks = res.data;
                this.makeGroups([
                    {title: "Todo", value: 1},
                    {title: "Doing", value: 2},
                    {title: "Done", value: 3}], "status");
            });
        }

        mounted() {
            $('[data-toggle="tooltip"]').tooltip();
        }

        makeGroups(groupEnum: { value: number, title: string }[], groupProp: string) {
            this.taskGroups = [];
            for (let group of groupEnum) {
                let tasks = this.tasks.filter(task => task[groupProp] === group.value);
                this.taskGroups.push({title: group.title, tasks});
            }

            let allValues = groupEnum.map(e => e.value);
            this.taskGroups.unshift({title: '[Draft]', tasks: this.tasks.filter(task => task[groupProp] == null || allValues.indexOf(task[groupProp]) == -1)});
        }

        startDrag(e, task: Task) {
            // let $this = this;
            // e = e || window.event;
            // e.preventDefault();
            // this.dragOffset = {x: e.clientX, y: e.clientY};
            //
            // let el = $(e.target);
            // let width = el.width();
            // let height = el.height();
            //
            // let movingBox = $(".moving-box").text(task.title);
            // movingBox.width(width - 8);
            // movingBox.height(height);
            // movingBox.css("top", el.position().top);
            // movingBox.css("left", el.position().left);
            //
            // this.tasks.splice(this.tasks.indexOf(e.task), 1);
            // this.draggedTask = e.task;
            //
            // document.onmouseup = (e) => {
            //     document.onmouseup = null;
            //     document.onmousemove = null;
            //     movingBox.hide();
            // };
            //
            // document.onmousemove = (e) => {
            //     e = e || window.event as any;
            //     e.preventDefault();
            //     movingBox.show();
            //     movingBox.css("top", movingBox.position().top - (this.dragOffset.y - e.clientY));
            //     movingBox.css("left", movingBox.position().left - (this.dragOffset.x - e.clientX));
            //     this.dragOffset.x = e.clientX;
            //     this.dragOffset.y = e.clientY;
            //
            //     $(".task-manager-box").removeClass("hover");
            //     $(".task-manager-box").each((i, box) => {
            //         let x1 = $(box).position().left;
            //         let y1 = $(box).position().top;
            //         let x2 = x1 + $(box).width();
            //         let y2 = y1 + $(box).height();
            //         if (x1 < e.clientX && x2 > e.clientX && y1 < e.clientY && y2 > e.clientY)
            //             $(box).addClass("hover");
            //     });
            // };
        }

        dragStart(event, task) {
            // event.dataTransfer.setData("Text", event.target.id);
            this.draggedTask = task;
        }

        dragging(event) {
            console.log(event.x, event.y);
            // document.getElementById("demo").innerHTML = "The p element is being dragged";
        }

        allowDrop(event, group) {
            event.preventDefault();
        }

        drop(event, group) {
            event.preventDefault();
            // let data = event.dataTransfer.getData("Text");
        }

        activateConcern(taskConcern: TaskConcern) {
            this.taskConcern = taskConcern;
        }

        newTask() {
            this.tasks.push({title: ""});
            this.$forceUpdate();
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

        .task-manager-box {
            font-size: .8rem;
            background-color: white;

            &.hover {
                background-color: gray !important;
            }

            input {
                background-color: transparent;
                cursor: default;
            }
        }
    }
</style>
