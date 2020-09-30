import {axios} from "../plugins/axios";

export const catapultState = {
    catapults: [],
    catapultPrice: undefined
};

export const catapultMutations = {
    SET_CATAPULTS(state, catapults) {
        console.log("[catapult] Set catapults: ", catapults);
        if (state.catapults.length === 0) {
            state.catapults = catapults;
        } else {
            catapults.forEach(c1 => {
                if (!state.catapults.some(c2 => c1.x === c2.x && c1.y === c2.y)) {
                    state.catapults.push(c1);
                }
            });
        }
    },
    SET_CATAPULT_PRICE(state, {price}) { // injected from websocket
        state.catapultPrice = price;
    },
    NEW_CATAPULT(state, catapult) { // injected from websocket
        console.log("[catapult] Got new catapult: ", catapult);
        state.catapults.push(catapult);
    },
    DELETE_CATAPULT(state, catapult) {
        console.log("[catapult] Delete catapult: ", catapult);
        state.catapults = state.catapults.filter(c => c.x !== catapult.x || c.y !== catapult.y);
    },
    UPDATE_CATAPULT(state, catapult) { // injected from websocket
        state.catapults = [
            ...state.catapults.filter(c => c.x !== catapult.x || c.y !== catapult.y),
            catapult
        ];
    }
};

export const catapultActions = {
    async CREATE_CATAPULT({commit}, position) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/catapult/create", position);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_CATAPULTS({commit}, {fromX, fromY, toX, toY}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/catapult?fromX=${fromX}&fromY=${fromY}&toX=${toX}&toY=${toY}`);
            commit("SET_CATAPULTS", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_CATAPULT_PRICE({commit}) {
    try {
        commit("PROGRESS", 1);
        const response = await axios.get(`/catapult/price`);
        commit("SET_CATAPULT_PRICE", response.data);
    } finally {
        commit("PROGRESS", -1);
    }
}
};
