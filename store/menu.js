export const state = () => ({
  isOpen: false,
})

export const mutations = {
  SHOW_MENU(state, visible) {
    state.isOpen = visible
  },
}

export const actions = {
  async showMenu({ commit, rootState }, visible) {
    commit('SHOW_MENU', visible)
  },
}

export const getters = {
  isOpen(state) {
    return state.isOpen;
  },
}