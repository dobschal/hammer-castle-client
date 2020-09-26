import {axios} from "../plugins/axios";

export const warehouseState = {
    warehouses: []
};

export const warehouseMutations = {
    SET_WAREHOUSES(state, warehouses) {
        console.log("[warehouse] Set warehouses: ", warehouses);
        if (state.warehouses.length === 0) {
            state.warehouses = warehouses;
        } else {
            warehouses.forEach(c1 => {
                if (!state.warehouses.some(c2 => c1.x === c2.x && c1.y === c2.y)) {
                    state.warehouses.push(c1);
                }
            });
        }
    },
    NEW_WAREHOUSE(state, warehouse) { // injected from websocket
        console.log("[warehouse] Got new warehouse: ", warehouse);
        state.warehouses.push(warehouse);
    },
    DELETE_WAREHOUSE(state, warehouse) {
        console.log("[warehouse] Delete warehouse: ", warehouse);
        state.warehouses = state.warehouses.filter(c => c.x !== warehouse.x || c.y !== warehouse.y);
    },
    UPDATE_WAREHOUSE(state, warehouse) { // injected from websocket
        state.warehouses = [
            ...state.warehouses.filter(c => c.x !== warehouse.x || c.y !== warehouse.y),
            warehouse
        ];
    }
};

export const warehouseActions = {
    async CREATE_WAREHOUSE({commit}, position) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/warehouse/create", position);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_WAREHOUSES({commit}, {fromX, fromY, toX, toY}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/warehouse?fromX=${fromX}&fromY=${fromY}&toX=${toX}&toY=${toY}`);
            commit("SET_WAREHOUSES", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
