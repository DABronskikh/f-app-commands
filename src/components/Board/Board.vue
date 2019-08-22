<template>
    <!--загрузка данных-->
    <div
            v-if="localLoading"
            class="text-xs-center align-center mt-5"
    >
        <v-progress-circular
                :size="100"
                :width="3"
                color="primary"
                indeterminate
        ></v-progress-circular>
    </div>

    <div v-else class="demo">

        <v-toolbar
                style="position: absolute; z-index: 1; left: 0; right: 0"
        >
            <v-toolbar-title class="w100">
                <update-board-title></update-board-title>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <labels-component></labels-component>
            <v-menu
                    :close-on-content-click="false"
            >

                <template v-slot:activator="{ on }">
                    <v-btn
                            icon
                            v-on="on"

                    >
                        <v-icon>insert_photo</v-icon>
                    </v-btn>
                </template>

                <v-card style="width: 200px" class="pa-1">
                    <p class="title pa-2">Выберите фон:</p>
                    <v-img v-for="(el, idx) in bfOptions"
                           :key="idx"
                           :src="el.value"
                           :lazy-src="el.value"
                           aspect-ratio="1"
                           class="grey lighten-2 ma-2"
                           @click="bf=el.value"
                    >
                        <template v-slot:placeholder>
                            <v-layout
                                    fill-height
                                    align-center
                                    justify-center
                                    ma-0
                            >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                            </v-layout>
                        </template>
                    </v-img>
                    <!--<form class="pa-3">-->
                        <!--<v-select v-model="bf"-->
                                  <!--:items="bfOptions"-->
                                  <!--label="выберите фон"-->
                        <!--&gt;</v-select>-->
                    <!--</form>-->
                </v-card>
            </v-menu>

        </v-toolbar>

        <div class="root-box pre style-1"
             :style="{'background': `url('${bf}')`}"
        >

            <div
                    class="scrollbar-box mt mt-5 mb-4 mr-2 ml-2"
                    v-for="column in columns"
                    :key="column.id"
            >

                <div class="fff column">
                    <update-column-title :column="column"></update-column-title>
                </div>

                <div class="scrollbar fff column style-1  pa-1">

                    <!--<draggable-->
                            <!--id="first"-->
                            <!--data-source="juju"-->
                            <!--:list="column.tasks"-->
                            <!--draggable=".item"-->
                            <!--group="a"-->
                    <!--&gt;-->
                        <div
                                class="item"
                                v-for="element in column.tasks"
                                :key="element.id"
                                @click=""
                                v-show="element.labels.indexOf(labelActiv) !== -1 || !filterOff"
                        >

                            <task-box
                                    :columnId="column.id"
                                    :task="element"
                            ></task-box>

                            <!--<v-chip class="caption" v-for="(el, idx) in 2">ярлык {{idx+1}}</v-chip>-->
                        </div>
                    <!--</draggable>-->
                    <!--<pre> {{ column.tasks }} </pre>-->
                </div>
                <create-new-task class="fff column" :id="column.id"></create-new-task>
                <div class="scrollbar fff column style-1  pa-1">

                    <draggable
                            id="second"
                            data-source="juju"
                            :list="column.lists"
                            draggable=".item"
                            group="a"
                    >
                        <div
                                class="item"
                                v-for="element in column.lists"
                                :key="element.id"
                                @click=""
                        >
                            <list-box :columnId="column.id" :list="element"></list-box>
                        </div>
                    </draggable>
                </div>
                <create-new-list class="fff column" :id="column.id"></create-new-list>
            </div>
            <!--добавить столбец-->
            <div class="scrollbar-box mt mb-5 mr-2 ml-2" style="padding-right: 10px">
                <v-card>
                    <create-column class="w100" :id="id"></create-column>
                </v-card>
            </div>

        </div>
    </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import CreateColumn from './CreateColumn'
  import UpdateBoardTitle from './UpdateBoardTitle'
  import LabelsComponent from './labelsComponent'
  import UpdateColumnTitle from './UpdateColumnTitle'
  import CreateNewTask from './Task/CreateNewTask'
  import TaskBox from './Task/TaskBox'
  import CreateNewList from './List/CreateNewList'
  import ListBox from './List/ListBox'

  export default {
    props: ['id'],
    name: 'Board',
    order: 14,
    components: {
      TaskBox,
      CreateNewTask,
      UpdateColumnTitle,
      LabelsComponent,
      CreateColumn,
      draggable,
      UpdateBoardTitle,
      CreateNewList,
      ListBox
    },
    data () {
      return {
        localLoading: false,
        newCollumnDialog: false,
        updateBoardTitleDialog: false,
        dialog: false,
        bf: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg',
        bfOptions: [
          {
            text: '1',
            value: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg'
          }, {
            text: '2',
            value: 'https://ns328286.ip-37-187-113.eu/ew/wallpapers/800x480/02715_800x480.jpg'
          }
        ],
      }
    },
    methods: {
      add: function (idx) {
        this.lists[idx].items.push({name: 'Juan ' + id, id: id++})
      },
      addList: function () {
        this.newCollumnDialog = !this.newCollumnDialog
      },
      demo: function () {
        this.dialog = !this.dialog
      },
      show (e) {
        e.preventDefault()
        this.showMenu = false
        this.x = e.clientX
        this.y = e.clientY
        this.$nextTick(() => {
          this.showMenu = true
        })
      }
    },
    mounted: function () {
      this.$nextTick(async () => {
        const {commit, dispatch} = this.$store
        commit('setLoading', true)
        this.localLoading = true
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
      labels () {
        return this.$store.getters.labels
      },
      columns () {
        return this.$store.getters.columns
      },
      loading () {
        return this.$store.getters.loading
      },
      boardTitle () {
        return this.$store.getters.boardTitle
      },
      boardId () {
        return this.$store.getters.boardId
      },
      labelActiv () {
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
        border-radius: 2px;
        //background: #eeeeee;
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
</style>
