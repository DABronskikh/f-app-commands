<template>
    <!--загрузка данных-->
    <div v-if="localLoading" class="text-xs-center align-center mt-5">
        <v-progress-circular :size="100" :width="3" color="primary" indeterminate></v-progress-circular>
    </div>

    <div v-else class="demo">

        <v-toolbar class="my-toolbar">
            <v-toolbar-title class="w100">
                <update-board-title></update-board-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <labels-component></labels-component>
            <v-menu :close-on-content-click="false">

                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>insert_photo</v-icon>
                    </v-btn>
                </template>

                <v-card class="pa-1 w200p">
                    <p class="title pa-2">Выберите фон:</p>
                    <v-img v-for="(el, idx) in bfOptions" :key="idx" :src="el.value" :lazy-src="el.value" aspect-ratio="1" class="grey lighten-2 ma-2" @click="bf=el.value">
                        <template v-slot:placeholder>
                            <v-layout fill-height align-center justify-center ma-0>
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                        </template>
                    </v-img>
                </v-card>
            </v-menu>

        </v-toolbar>

        <div class="root-box style-1 pl-2 " :style="{'background': `url('${bf}')`}">
            <draggable class="pre" v-model="columns" @change="onColumnMoved($event, columns)">
                <div class="scrollbar-box mt-4 mb-4 mr-2 ml-2" v-for="(column, index) in columns" :key="column.id">

                    <div class="fff column">
                        <update-column-title :column="column"></update-column-title>
                    </div>

                    <div class="scrollbar fff column style-1  pa-1">
                        <draggable v-model="column.tasks" item @change="onTaskMoved($event, column)">

                            <div class="item" v-for="element in column.tasks" :key="element.id" v-show="element.labels.indexOf(labelActiv) !== -1 || !filterOff" @click="openTaskDialog(element, column.id)">
                                <task-box-mini :task="element">
                                </task-box-mini>
                            </div>
                            <create-new-task slot="footer" class="fff column" :id="column.id">
                            </create-new-task>
                        </draggable>

                    </div>


                    <div class="scrollbar fff column style-1  pa-1">
                        <!--<draggable-->
                        <!--id="second"-->
                        <!--data-source="juju"-->
                        <!--:list="column.lists"-->
                        <!--draggable=".item"-->
                        <!--group="a"-->
                        <!--&gt;-->


                        <div class="item" v-for="element in column.lists" :key="element.id" @click="openListDialog(element, column.id)">
                            <div class="title pa-1">
                                {{element.title}}
                            </div>
                            <!--<list-box :columnId="column.id" :list="element"></list-box>-->
                        </div>
                        <!--</draggable>-->
                    </div>

                    <create-new-list class="fff column" :id="column.id"></create-new-list>

                </div>
                <!--добавить столбец-->
                <div class="scrollbar-box mt-4 mb-5 mr-2 ml-2 pr-3" slot="footer">
                    <v-card>
                        <create-column class="w100" :id="id"></create-column>
                    </v-card>
                </div>
            </draggable>
        </div>

        <!-- Диалог работы с задачами -->
        <v-dialog v-model="dialogTask" width="700">
            <v-card>
                <v-card-title class="headline  lighten-2">
                    <update-task-title :columnId="taskActiv.columnId" :id="taskActiv.id"></update-task-title>
                </v-card-title>
                <div v-if="loadingLocalTaskDialog" class="text-xs-center align-center mt-5">
                    <v-progress-circular :size="100" :width="3" color="primary" indeterminate></v-progress-circular>
                    <br> <br> <br>
                </div>
                <div v-else>
                    <v-divider></v-divider>

                    <update-task-description></update-task-description>

                    <v-divider></v-divider>

                    <update-task-labels :columnId="taskActiv.columnId"></update-task-labels>

                    <v-card-actions style="margin-top: -25px">
                        <v-spacer></v-spacer>
                        <v-btn flat @click="dialogTask = false">Закрыть</v-btn>
                    </v-card-actions>
                </div>
            </v-card>
        </v-dialog>
        <!---->

        <!-- Диалог работы со списками -->
        <v-dialog v-model="dialogList" width="700">
            <v-card>
                <v-card-title class="headline  lighten-2">
                    <update-list-title :columnId="listActiv.columnId" :id="listActiv.list.id" :listTitle="listActiv.list.title" :list="listActiv.list"></update-list-title>
                </v-card-title>

                <div v-if="loadingLocalListDialog" class="text-xs-center align-center mt-5">
                    <v-progress-circular :size="100" :width="3" color="primary" indeterminate></v-progress-circular>
                    <br> <br> <br>
                </div>
                <div v-else>
                    <v-card-text>
                        <list-items :list="listActiv.list"></list-items>
                    </v-card-text>
                </div>
                <v-card-actions style="margin-top: -25px">
                    <v-spacer></v-spacer>
                    <v-btn flat @click="dialogList = false">Закрыть</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!---->

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import CreateColumn from './CreateColumn'
    import UpdateBoardTitle from './UpdateBoardTitle'
    import LabelsComponent from './labelsComponent'
    import UpdateColumnTitle from './UpdateColumnTitle'
    import CreateNewTask from './Task/CreateNewTask'
    import CreateNewList from './List/CreateNewList'
    import TaskBoxMini from './Task/TaskBoxMini'
    import UpdateTaskDescription from './Task/UpdateTaskDescription'
    import UpdateTaskTitle from './Task/UpdateTaskTitle'
    import UpdateTaskLabels from './Task/UpdateTaskLabels'
    import UpdateListTitle from './List/UpdateListTitle'
    import ListItems from './List/ListItems'

    export default {
        props: ['id'],
        name: 'Board',
        order: 14,
        components: {
            ListItems,
            UpdateListTitle,
            UpdateTaskLabels,
            UpdateTaskTitle,
            UpdateTaskDescription,
            TaskBoxMini,
            CreateNewTask,
            UpdateColumnTitle,
            LabelsComponent,
            CreateColumn,
            draggable,
            UpdateBoardTitle,
            CreateNewList,
        },
        data() {
            return {
                localLoading: false,
                newCollumnDialog: false,
                updateBoardTitleDialog: false,
                dialog: false,
                dialogTask: false,
                dialogList: false,
                loadingLocalTaskDialog: false,
                loadingLocalListDialog: false,
                taskActiv: {
                    id: '',
                    taskTitle: '',
                    columnId: '',
                },
                listActiv: {
                    list: '',
                    columnId: '',
                },
                bf: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg',
                bfOptions: [{
                    text: '1',
                    value: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg'
                }, {
                    text: '2',
                    value: 'https://ns328286.ip-37-187-113.eu/ew/wallpapers/800x480/02715_800x480.jpg'
                }],
            }
        },
        methods: {
            onTaskMoved: async function ($event, column) {
                let oldIndex = $event.moved.oldIndex;
                let newIndex = $event.moved.newIndex;
                if (newIndex < oldIndex) {
                    if (newIndex === 0) {
                        column.tasks[oldIndex].position = column.tasks[newIndex].position - 100;
                    } else {
                        const positionToMove = Math.floor((column.tasks[newIndex].position - column.tasks[newIndex - 1].position) / 2);
                        column.tasks[oldIndex].position = column.tasks[newIndex].position - positionToMove;
                    }
                } else {
                    if (newIndex === column.tasks.length - 1) {
                        column.tasks[oldIndex].position = column.tasks[newIndex].position + 100;
                    } else {
                        const positionToMove = Math.floor((column.tasks[newIndex].position - column.tasks[newIndex + 1].position) / 2);
                        column.tasks[oldIndex].position = column.tasks[newIndex].position - positionToMove;
                    }
                }
                const taskToMove = {
                    id_column: column.id,
                    id: column.tasks[oldIndex].id,
                    position: column.tasks[oldIndex].position,
                };
                await this.$store.dispatch('updateTaskPosition', taskToMove);
            },
            onColumnMoved: async function ($event, columns) {
                let oldIndex = $event.moved.oldIndex;
                let newIndex = $event.moved.newIndex;
                if (newIndex < oldIndex) {
                    if (newIndex === 0) {
                        columns[oldIndex].position = columns[newIndex].position - 100;
                    } else {
                        const positionToMove = Math.floor((columns[newIndex].position - columns[newIndex - 1].position) / 2);
                        columns[oldIndex].position = columns[newIndex].position - positionToMove;
                    }
                } else {
                    if (newIndex === columns.length - 1) {
                        columns[oldIndex].position = columns[newIndex].position + 100;
                    } else {
                        const positionToMove = Math.floor((columns[newIndex].position - columns[newIndex + 1].position) / 2);
                        columns[oldIndex].position = columns[newIndex].position - positionToMove;
                    }
                }
                const columnsToMove = {
                    id: columns[oldIndex].id,
                    id_board: columns[oldIndex].id_board,
                    position: columns[oldIndex].position,
                };
                await this.$store.dispatch('updateColumnPosition', columnsToMove);
            },
            add: function (idx) {
                this.lists[idx].items.push({
                    name: 'Juan ' + id,
                    id: id++
                })
            },
            addList: function () {
                this.newCollumnDialog = !this.newCollumnDialog
            },
            demo: function () {
                this.dialog = !this.dialog
            },
            show(e) {
                e.preventDefault()
                this.showMenu = false
                this.x = e.clientX
                this.y = e.clientY
                this.$nextTick(() => {
                    this.showMenu = true
                })
            },
            async openTaskDialog(task, columnId) {
                this.taskActiv = {
                    columnId: columnId,
                    id: task.id,
                }

                const {
                    commit,
                    dispatch
                } = this.$store
                this.dialogTask = true
                this.loadingLocalTaskDialog = true
                commit('setLoading', true)
                await dispatch('fetchTask', task.id)
                this.loadingLocalTaskDialog = false
                commit('setLoading', false)
            },
            async openListDialog(list, columnId) {
                this.listActiv = {
                    list,
                    columnId
                }

                const {
                    commit,
                    dispatch
                } = this.$store
                this.dialogList = true
                this.loadingLocalListDialog = true
                commit('setLoading', true)
                await dispatch('fetchList', list.id)
                this.loadingLocalListDialog = false
                commit('setLoading', false)
            },
        },
        mounted: function () {
            this.$nextTick(async () => {
                const {
                    commit,
                    dispatch
                } = this.$store
                commit('setLoading', true)
                this.localLoading = true
                commit('setFilterOff', false)
                commit('setLabelActiv', null)
                let res = await dispatch('fetchBoard', this.id)
                if (res === -1) {
                    this.$router.push('/boards')
                } else if (res === 401) {
                    dispatch('logoutUser')
                    this.$router.push('/')
                }
                commit('setLoading', false)
                this.localLoading = false
            })
        },
        computed: {
            labels() {
                return this.$store.getters.labels
            },
            columns: {
                get: function () {
                    let unsortedColumns = this.$store.getters.columns;
                    unsortedColumns.sort((a, b) => a.position - b.position);
                    unsortedColumns.forEach(element => {
                        element.tasks.sort((a, b) => a.position - b.position);
                        return element;
                    });
                    return unsortedColumns;
                },
                set: function (val) {
                    this.$store.commit('setColumns', val);
                },
            },
            loading() {
                return this.$store.getters.loading
            },
            boardTitle() {
                return this.$store.getters.boardTitle
            },
            boardId() {
                return this.$store.getters.boardId
            },
            labelActiv() {
                return this.$store.getters.labelActiv
            },
            filterOff() {
                return this.$store.getters.filterOff
            },
        }
    }

</script>
<style lang="scss" scoped>
    .column {
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
        z-index: 1;
    }

    .fff {
        background: #fff;
    }

    .w100 {
        width: 100%;
    }

    .list-group {
        background: #f0f0f0;
        padding: 15px;
        border-radius: 5px;
    }

    .item {
        border: 1px solid #b3b3b3;
        border-radius: 3px;
        padding: 10px;
        margin: 5px;
        transition: background-color .3s;
        cursor: pointer;

        &:hover {
            background: rgba(238, 238, 238, 0.79);
        }
    }

    .pre {
        max-height: 100vh;
        display: flex;
        position: relative;
        overflow-y: hidden;
        overflow-x: auto;

        & pre {
            margin: 10px;
            padding: 10px;
        }
    }

    pre {
        font-size: .8rem;
    }

    .scrollbar {
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 1;
        min-height: 0;
    }

    .scrollbar-box {
        display: flex;
        flex-direction: column;
        border-radius: 3px;
        min-width: 350px;
        max-width: 350px;
    }

    .style-1::-webkit-scrollbar {
        width: 10px;
        height: 15px;
        background-color: #F5F5F5;
        transition: .5s;
    }

    .style-1::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
        background-color: #555;
        transition: .5s;

        &:hover {
            background-color: #79a2e4;
        }
    }

    .root-box {
        transition: background .3s;
        background-size: cover !important;
        height: 100vh;
    }

    .demo {
        padding: 0;
        margin: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
    }

    .bg {
        background: #eeeeee;
    }

    .column {
        padding: 10px;
    }

    .top-menu-board {
        position: fixed;
        left: 0;
        right: 0;
    }

    .mt {
        margin-top: 75px !important;
    }

    .w200p {
        width: 200px;
    }

</style>
