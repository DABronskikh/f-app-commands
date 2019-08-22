import URL from '../URL'

export default {
  state: {
    columns: [],
    task: {},
    list: {},
    listItems: []
  },
  mutations: {
    setColumns (state, payload) {
      state.columns = [...payload]
      console.log('state.columns', payload)
    },
    addColumns (state, payload) {
      state.columns = state.columns.concat(payload)
      console.log('state.columns add', payload)
      console.log('state.columns', state.columns)
    },
    updateColumn (state, payload) {
      const idx = state.columns.findIndex(el => +el.id === +payload.id)
      state.columns[idx].title = payload.title
      state.columns = state.columns.concat()
    },
    addTask (state, payload) {
      const idx = state.columns.findIndex(el => +el.id === +payload.id_column)
      state.columns[idx].tasks = state.columns[idx].tasks.concat(payload)
    },
    updateTaskTitle (state, payload) {
      const idxCol = state.columns.findIndex(el => +el.id === +payload.columnId)
      const idxTask = state.columns[idxCol].tasks.findIndex(el => +el.id === +payload.id)
      state.columns[idxCol].tasks[idxTask].title = payload.title
      state.columns = state.columns.concat()
      state.task.title = payload.title
    },
    setTask (state, payload) {
      payload.description = payload.description !== null ? payload.description : ''
      state.task = payload
      console.log('state.task', payload)
    },
    setList (state, payload) {
      state.list = payload
    },
    addList (state, payload) {
      const idx = state.columns.findIndex(el => +el.id === +payload.id_column)
      state.columns[idx].lists = state.columns[idx].lists.concat(payload)
    },
    updateTaskDescription (state, payload) {
      state.task.description = payload.description
    },
    updateListTitle (state, payload) {
      const idxCol = state.columns.findIndex(el => +el.id === +payload.columnId)
      const idxList = state.columns[idxCol].lists.findIndex(el => +el.id === +payload.id)
      state.columns[idxCol].lists[idxList].title = payload.title
      state.columns = state.columns.concat()
      state.list.title = payload.title
    },
    addListItem (state, payload) {
      state.listItems = state.listItems.concat(payload)
    },
    setListItems (state) {
      state.listItems = state.list.listItems
    },
    updateTaskLabels (state, payload) {
      const idxCol = state.columns.findIndex(el => +el.id === +payload.columnId)
      const idxTask = state.columns[idxCol].tasks.findIndex(el => +el.id === +payload.id)
      state.columns[idxCol].tasks[idxTask].labels = payload.labels
      state.columns = state.columns.concat()
      state.task.labels = payload.labels
    },
    updateListItemTitle (state, {title, id}) {
      const listItem = state.listItems.filter(listItem => +listItem.id === id)
      listItem[0].title = title
    },
    updateListItemExecution (state, payload) {
      const listItem = state.listItems.filter(listItem => +listItem.id === payload.id)
      listItem[0].execution = payload.execution
    }
  },
  actions: {
    async createColumn ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/column`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            payload.id = result.data.id
            payload.lists = []
            payload.tasks = []
            commit('addColumns', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateColumnTitle ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/column/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log('updateLabel', result)
          if (result.status === 1) {
            commit('updateColumn', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async createTask ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/task`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            payload.id = result.data.id
            payload.position = result.data.position
            payload.description = null
            payload.labels = []
            commit('addTask', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async fetchTask ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/task?id=${payload}`,
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': getters.user,
          },
          method: 'GET',
        })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        })
        .then(json => {
            console.log('json ', json)
            if (json.status === 1) {
              commit('setTask', json.data)
            } else if (json.status === -1) {
              commit('clearSnackbar')
              commit('setSnackbarMsg', Object.values(json.message).join('; '))
              commit('setSnackbarType', 'error')
            } else if (json.status === 401) {
              commit('clearSnackbar')
              commit('setSnackbarMsg', 'Требуется авторизация')
              commit('setSnackbarType', 'error')
            }
            return json.status
          }
        )
        .catch(
          error => {
            console.error(error)
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async createList ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/list`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            payload.id = result.data.id
            payload.position = result.data.position
            commit('addList', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async fetchList ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/list?id=${payload}`,
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': getters.user,
          },
          method: 'GET',
        })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        })
        .then(json => {
            console.log('json ', json)
            if (json.status === 1) {
              commit('setList', json.data)
              commit('setListItems')
            } else if (json.status === -1) {
              commit('clearSnackbar')
              commit('setSnackbarMsg', Object.values(json.message).join('; '))
              commit('setSnackbarType', 'error')
            } else if (json.status === 401) {
              commit('clearSnackbar')
              commit('setSnackbarMsg', 'Требуется авторизация')
              commit('setSnackbarType', 'error')
            }
            return json.status
          }
        )
        .catch(
          error => {
            console.error(error)
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateTaskTitle ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/task/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log('updateLabel', result)
          if (result.status === 1) {
            commit('updateTaskTitle', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateTaskDescription ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/task/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            commit('updateTaskDescription', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateListTitle ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/list/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          if (result.status === 1) {
            commit('updateListTitle', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async createListItem ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/list-item`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            commit('addListItem', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateTaskLabels ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/task/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          console.log(result)
          if (result.status === 1) {
            commit('updateTaskLabels', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateListItemTitle ({commit, getters}, payload) {
      console.log(payload)
      return fetch(`${URL}/api/v1/list-item/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          if (result.status === 1) {
            commit('updateListItemTitle', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async updateListItemExecution ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/list-item/${payload.id}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user
        },
        method: 'PATCH',
        body: JSON.stringify(payload)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          if (result.status === 1) {
            commit('updateListItemExecution', payload)
          } else if (result.status === -1) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', Object.values(result.message).join('; '))
            commit('setSnackbarType', 'error')
          } else if (result.status === 401) {
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          return result.status
        })
        .catch(
          error => {
            console.error(error)
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
  },
  getters: {
    columns (state) {
      return state.columns
    },
    task (state) {
      return state.task
    },
    list (state) {
      return state.list
    },
    listItems (state) {
      return state.listItems
    },
    listItemExecution (state) {
      return listItemId => {
        const listItem = state.listItems.filter(listItems => +listItems.id === +listItemId)
        return listItem[0].execution === 1
      }
    }
  }
}
