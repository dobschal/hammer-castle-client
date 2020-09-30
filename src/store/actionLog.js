import {axios} from "../plugins/axios";

export const actionLogState = {
    actionLog: []
};

export const actionLogMutations = {
    SET_ACTION_LOG(state, actionLogs) {
        state.actionLog = actionLogs;
    },
    NEW_ACTION_LOG(state, actionLog) { // injected from websocket
        state.actionLog = [
            ...state.actionLog.filter(a => a.id !== actionLog.id),
            actionLog
        ];
    }
};

export const actionLogActions = {
    async GET_ACTION_LOG({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/action-log`);
            console.log("[actionLog] Got action log: ", response);
            commit("SET_ACTION_LOG", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
