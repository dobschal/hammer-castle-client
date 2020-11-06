import {axios} from "../plugins/axios";

/**
 * @typedef FriendState
 * @type object
 * @property {Friend[]} friends
 *
 * @type {FriendState}
 */
export const friendState = {
    friends: []
};

export const friendMutations = {

    /**
     * @param {FriendState} state
     * @param {Friend[]} friends
     */
    SET_FRIENDS(state, {friends}) {
        state.friends = friends.sort((a, b) => b.level - a.level);
    }
};

export const friendActions = {

    /**
     * @param {function(string, *)} commit
     * @param {string} query
     */
    async FIND_USER({commit}, query) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.post("/friend/find-user", {query});
            return response.data;
        } finally {
            commit("PROGRESS", -1);
        }
    },

    /**
     * @param {function(string, *)} commit
     * @param {string} username
     */
    async ADD_FRIEND({commit}, username) {
        try {
            commit("PROGRESS", 1);
            await axios.post(`/friend/add`, {username});
        } finally {
            commit("PROGRESS", -1);
        }
    },

    /**
     * @param {function(string, *)} commit
     */
    async GET_FRIENDS({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/friend/list`);
            commit("SET_FRIENDS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
