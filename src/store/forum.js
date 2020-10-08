import {axios} from "../plugins/axios";

export const forumState = {
    forumCategories: [],
    forumEntries: []
};

export const forumMutations = {
    SET_FORUM_CATEGORIES(state, categories) {
        state.forumCategories = categories;
    },
    SET_FORUM_ENTRIES(state, forumEntries) {
        state.forumEntries = forumEntries;
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
    },
    async GET_FORUM_ENTRIES({commit}, categoryId) {
        try {
            commit("PROGRESS", 1);
            commit("SET_FORUM_ENTRIES", []);
            const response = await axios.get(`/forum/entry?category_id=${categoryId}`);
            commit("SET_FORUM_ENTRIES", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async CREATE_FORUM_ENTRY({commit}, entry) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/forum/entry", entry);
        } finally {
            commit("PROGRESS", -1);
        }
    },
};
