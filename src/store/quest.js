import {axios} from "../plugins/axios";

export const questState = {
    quests: []
};

export const questMutations = {
    SET_QUESTS(state, quests) {
        state.quests = quests;
    },
    UPDATE_QUEST(state, quest) {
        const index = state.quests.findIndex(q => q.id == quest.id);
        if (index === -1) {
            state.quests.push(quest);
        } else {
            state.quests[index] = {
                ...state.quests[index],
                ...quest
            };
        }
    }
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
    async READ_NEW_QUEST({commit}, quest) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.post(`/quest/read`, {questId: quest.id});
            if (response.data.success) {
                quest.status = "OPEN_SEEN";
                commit("UPDATE_QUEST", quest);
            }
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async CLAIM_QUEST_REWARD({commit}, quest) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.post(`/quest/claim`, {questId: quest.id});
            if (response.data.success) {
                quest.status = "SOLVED_SEEN";
                commit("UPDATE_QUEST", quest);
            }
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
