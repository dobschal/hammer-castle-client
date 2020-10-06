import {axios} from "../plugins/axios";

export const forumState = {
    forumCategories: []
};

export const forumMutations = {
    SET_FORUM_CATEGORIES(state, categories) {
        state.forumCategories = categories;
    }
};

export const forumActions = {
    async CREATE_FORUM_CATEGORY({commit}, category) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/forum/category", category);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_FORUM_CATEGORIES({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/forum/category`);
            commit("SET_FORUM_CATEGORIES", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
