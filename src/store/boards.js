import URL from '../URL'

export default {
  state: {
    boards: [],
    labels: [],
    title: '',
    boardId: null,
  },
  mutations: {
    setBoards (state, payload) {
      state.boards = [...payload]
      //console.log('state.boards', payload)
    },
    addBoards (state, payload) {
      state.boards = state.boards.concat(payload)
      //console.log('state.boards add', payload)
      //console.log('state.boards', state.boards)
    },
    setBoardTitle (state, payload) {
      state.title = payload
      //console.log('state.title', payload)
    },
    setLabels (state, payload) {
      state.labels = [...payload]
      //console.log('state.labels', payload)
    },
    addLabels (state, payload) {
      state.labels = state.labels.concat(payload)
      //console.log('state.labels add', payload)
      //console.log('state.labels', state.labels)
    },
    updateLabels (state, payload) {
      const idx = state.labels.findIndex(el => +el.id === +payload.id)
      state.labels[idx] = payload
    },
    setBoardId (state, payload) {
      state.boardId = +payload
      //console.log('state.boardId', +payload)
    },
  },
  actions: {
    async fetchBoard ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/board?id=${payload}`,
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
            //console.log('json ', json)
            if (json.status === 1) {
              const {title, columns, labels, id} = json.data
              commit('setBoardTitle', title)
              commit('setColumns', columns)
              commit('setLabels', labels)
              commit('setBoardId', id)
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
    async fetchBoards ({commit, getters}) {
      return fetch(`${URL}/api/v1/board`,
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
            //console.log('json ', json)
            if (json.status === 1) {
              commit('setBoards', json.data.boards)
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
            commit('clearSnackbar')
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
          }
        )
    },
    async createBoard ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/board`, {
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
          //console.log(result)
          if (result.status === 1) {
            payload.id = result.data.id
            commit('addBoards', payload)
            this.boardName = ''
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
    async updateBoardTitle ({commit, getters}, payload) {
      let {id_board} = payload
      return fetch(`${URL}/api/v1/board/${id_board}`, {
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
          //console.log(result)
          if (result.status === 1) {
            this.boardName = ''
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
    async createLabel ({commit, getters}, payload) {
      return fetch(`${URL}/api/v1/label`, {
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
          //console.log(result)
          if (result.status === 1) {
            payload.id = result.data.id
            commit('addLabels', payload)
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
    async updateLabel ({commit, getters}, {newData, id_label}) {
      return fetch(`${URL}/api/v1/label/${id_label}`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': getters.user,
        },
        method: 'PATCH',
        body: JSON.stringify(newData)
      })
        .then(response => {
          commit('setUserHeader', response)
          return response.json()
        }).then(result => {
          //console.log('updateLabel', result)
          if (result.status === 1) {
            commit('updateLabels', newData)
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
    boards (state) {
      return state.boards
    },
    labels (state) {
      return state.labels
    },
    boardTitle (state) {
      return state.title
    },
    boardId (state) {
      return state.boardId
    },
  }
}
