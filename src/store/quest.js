import {axios} from "../plugins/axios";

export const questState = {
    quests: []
};

export const questMutations = {
    SET_QUESTS(state, quests) {
        state.quests = quests;
    },
};

export const questActions = {
    async GET_QUESTS({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/quest/next`);
            commit("SET_QUESTS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
};
