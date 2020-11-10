import {axios} from "../plugins/axios";

/**
 * @typedef KnightState
 * @type object
 * @property {Knight[]} knights
 * @property {number} knightPrice
 */
export const knightState = {
    knights: [],
    knightPrice: undefined
};

export const knightMutations = {

    /**
     * @param {KnightState} state
     * @param {Knight[]} knights
     */
    SET_KNIGHTS(state, knights) {
        state.knights = knights;
    },

    /**
     * @param {KnightState} state
     * @param {number} price
     */
    SET_KNIGHT_PRICE(state, {price}) { // injected from websocket
        state.knightPrice = price;
    },

    /**
     * @param {KnightState} state
     * @param {Knight} knight
     */
    NEW_KNIGHT(state, knight) { // injected from websocket
        state.knights.push(knight);
    },

    /**
     * @param {KnightState} state
     * @param {Knight} knight
     */
    DELETE_KNIGHT(state, knight) {
        console.log("[knight] Delete knight: ", knight);
        state.knights = state.knights.filter(k => k.id !== knight.id);
    },

    /**
     * @param {KnightState} state
     * @param {Knight} knight
     */
    UPDATE_KNIGHT(state, knight) { // injected from websocket
        console.log("[knight] Update knight: ", knight);
        state.knights = [
            ...state.knights.filter(k => k.id !== knight.id),
            knight
        ];
    }
};

export const knightActions = {

    /**
     * @param {function(string, *)} commit
     * @param {number} knightId
     * @param {number} x
     * @param {number} y
     */
    async MOVE_KNIGHT({commit}, {knightId, x, y}) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/knight/move", {
                knightId, x, y
            });
        } finally {
            commit("PROGRESS", -1);
        }
    },

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
