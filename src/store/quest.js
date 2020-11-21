import {axios} from "../plugins/axios";

export const questState = {
    quests: []
};

export const questMutations = {
    SET_QUESTS(state, quests) {
        state.quests = quests;
    },
    UPDATE_QUEST(state, quest) {
        state.quests = [
            ...state.quests.filter(q => q.id !== quest.id),
            quest
        ];
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
    }
};
