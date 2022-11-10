import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms

    diversified: false,
    currFreet: null,

    supportDiscussions: [],
    neutralDiscussions: [],
    opposeDiscussions: [],

  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());

      let diversifiedRes = []
      if (state.diversified) {
        diversifiedRes = await fetch('/api/diversify').then(async r => r.json());
        console.log(diversifiedRes);
        if (diversifiedRes.error) {
          // TODO: fix alert when user not logged in
          alert(diversifiedRes.error)
          return diversifiedRes;
        }
        state.freets = diversifiedRes.concat(res);
      } else {
        state.freets = res
      }
    },
    toggleDiversify(state) {
      /**
       * Update the state deciding if diversified freets should be shown
       */
      state.diversified = !state.diversified;
    },
    async refreshDiscussions(state, freetId) {
      state.currFreet = await fetch(`/api/freets/${freetId}`).then(async r => r.json());
      console.log(state.currFreet)
      const res = await fetch(`/api/discussions/${freetId}`).then(async r => r.json());

      const supportRes = await fetch(
          `/api/replies/${res.supportDiscussion._id}`
      ).then(async r => r.json());
      const neutralRes = await fetch(
          `/api/replies/${res.neutralDiscussion._id}`
      ).then(async r => r.json());
      const opposeRes = await fetch(`/api/replies/${res.opposeDiscussion._id}`).then(async r => r.json());

      state.supportDiscussions = supportRes;
      state.neutralDiscussions = neutralRes;
      state.opposeDiscussions = opposeRes;
    },
  },
  actions: {
    toggleDiversify(context) {
      context.commit('toggleDiversify');
      context.commit('refreshFreets');
    },
    refreshDiscussionsAction(context, {freetId}) {
      context.commit('refreshDiscussions', freetId);
    }
  },
  getters: {
    // getFreetById: (state) => (freetId) => {
    //   const freet = state.freets.find((freet) => freet.freet._id === freetId);
    //   return freet
    // },
  
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
