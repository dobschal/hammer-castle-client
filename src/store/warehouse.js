import {axios} from "../plugins/axios";

export const warehouseState = {
    warehouses: [],
    warehousePrice: undefined,
    warehouseAmount: undefined,
    warehouseUpgradePrice: undefined
};

export const warehouseMutations = {
    SET_WAREHOUSES(state, warehouses) {
        state.warehouses = warehouses;
    },
    SET_WAREHOUSE_AMOUNT(state, {amount}) { // injected from websocket
        state.warehouseAmount = amount;
    },
    SET_WAREHOUSE_UPGRADE_PRICE(state, {price}) { // injected from websocket
        state.warehouseUpgradePrice = price;
    },
    SET_WAREHOUSE_PRICE(state, {price}) { // injected from websocket
        state.warehousePrice = price;
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
    async UPGRADE_WAREHOUSE({commit}, position) {
        try {
            commit("PROGRESS", 1);
            await axios.post("/warehouse/upgrade", position);
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
    },
    async GET_WAREHOUSE_PRICE({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/warehouse/price`);
            commit("SET_WAREHOUSE_PRICE", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_WAREHOUSE_UPGRADE_PRICE({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/warehouse/upgrade-price`);
            commit("SET_WAREHOUSE_UPGRADE_PRICE", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    },
    async GET_WAREHOUSE_AMOUNT({commit}) {
        try {
            commit("PROGRESS", 1);
            const response = await axios.get(`/warehouse/amount`);
            commit("SET_WAREHOUSE_AMOUNT", response.data);
        } finally {
            commit("PROGRESS", -1);
        }
    }
};
