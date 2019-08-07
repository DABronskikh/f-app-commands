import URL from '../URL'

export default {
  state: {
    boards: [],
  },
  mutations: {
    setBoards (state, payload) {
      state.boards = [...payload]
      console.log(payload)
    },
    createBoard (state, payload) {
      state.boards.push(payload)
    }
  },
  actions: {
    async fetchBoards ({commit}, payload) {
      commit('clearSnackbar')
      commit('setLoading', true)
      return fetch(`${URL}/api/v1/board`,
        {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Authorization': localStorage.getItem('user'),
          },
          method: 'GET',
        })
        .then(response => response.json())
        .then(
          json => {
            console.log('json ', json)
            if (json.status === 1) {
              commit('setBoards', json.data.boards)
            }
            if (json.status === 401) {
              commit('setSnackbarMsg', 'Требуется авторизация')
              commit('setSnackbarType', 'error')
            }
            commit('setLoading', false)
          }
        )
        .catch(
          error => {
            console.error(error)
            commit('setSnackbarMsg', 'Ошибка загрузки данных')
            commit('setSnackbarType', 'error')
            commit('setLoading', false)
            return false
          }
        )
    },
    async createBoard ({commit}, {name}) {
      commit('clearSnackbar')
      return fetch(`${URL}/api/v1/board`, {
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Authorization': localStorage.getItem('user'),
        },
        method: 'POST',
        body: JSON.stringify({
          name,
        })
      })
        .then(response => response.json())
        .then(result => {
          console.log(result)
          if (result.status === 1) {
            commit('setSnackbarMsg', 'Создана новая доска')
            commit('setSnackbarType', 'success')
          }
          if (result.status === 401) {
            commit('setSnackbarMsg', 'Требуется авторизация')
            commit('setSnackbarType', 'error')
          }
          commit('setLoading', false)
        })
        .catch(error => {
          console.error(error)
          commit('setSnackbarMsg', 'Ошибка загрузки данных')
          commit('setSnackbarType', 'error')
          commit('setLoading', false)
        })
    }
  },
  getters: {
    boards (state) {
      return state.boards
    },
  }
}
