import {axios} from "../plugins/axios";

export const knightState = {
    knights: [],
    knightPrice: undefined
};

export const knightMutations = {
    SET_KNIGHTS(state, knights) {
        state.knights = knights;
    },
    SET_KNIGHT_PRICE(state, {price}) { // injected from websocket
        state.knightPrice = price;
    },
    NEW_KNIGHT(state, knight) { // injected from websocket
        console.log("[knight] Got new knight: ", knight);
        state.knights.push(knight);
    },
    DELETE_KNIGHT(state, knight) {
        console.log("[knight] Delete knight: ", knight);
        state.knights = state.knights.filter(c => c.x !== knight.x || c.y !== knight.y);
    },
    UPDATE_KNIGHT(state, knight) { // injected from websocket
        state.knights = [
            ...state.knights.filter(c => c.x !== knight.x || c.y !== knight.y),
            knight
        ];
    }
};

export const knightActions = {
    async CREATE_KNIGHT({commit}, position) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/knight/create", position);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_KNIGHTS({commit}, {fromX, fromY, toX, toY}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/knight?fromX=${fromX}&fromY=${fromY}&toX=${toX}&toY=${toY}`);
            console.log("[knight] Here comes the knight: ", response.data);
            commit("SET_KNIGHTS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_KNIGHT_PRICE({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/knight/price`);
            commit("SET_KNIGHT_PRICE", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
