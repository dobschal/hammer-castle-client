import {axios} from "../plugins/axios";

export const blockAreaState = {
    blockAreas: []
};

export const blockAreaMutations = {
    SET_BLOCK_AREAS(state, blockAreas) {
        state.blockAreas = blockAreas;
    },
    NEW_BLOCK_AREA(state, blockArea) { // injected from websocket
        state.blockAreas.push(blockArea);
    },
    UPDATE_BLOCK_AREA(state, blockArea) { // injected from websocket
        state.blockAreas = [
            ...state.blockAreas.filter(c => c.x !== blockArea.x || c.y !== blockArea.y),
            blockArea
        ]
    }
};

export const blockAreaActions = {
    async GET_BLOCK_AREAS({commit}) {

        // TODO: Loaded brick wise...

        try {
            commit("PROGRESS", 1);
            const response = await axios.get("/block-area");
            commit("SET_BLOCK_AREAS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
