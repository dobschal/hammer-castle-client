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
        console.log("[blockArea] Update blockArea from websocket: ", blockArea);
        state.blockAreas = [
            ...state.blockAreas.filter(c => c.x !== blockArea.x || c.y !== blockArea.y),
            blockArea
        ]
    }
};

export const blockAreaActions = {
    async GET_BLOCK_AREAS({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get("/block-area");
            console.log("[blockArea] Got block areas: ", response);
            commit("SET_BLOCK_AREAS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
