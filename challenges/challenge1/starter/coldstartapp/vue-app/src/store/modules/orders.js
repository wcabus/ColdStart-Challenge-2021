import axios from 'axios';
import API from '../config';
import { parseItem } from './action-utils';
import { POST_ORDER } from './mutation-types';

const captains = console;

export default {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    orders: [],
  },
  mutations: {
    [POST_ORDER](state, order) {
      state.orders.push(order);
    },
  },
  actions: {
    async postOrderAction({ commit }, icecreamId) {
      try {
        const response = await axios.post(`${API}/orders`, { icecreamId });
        const order = parseItem(response);
        commit(POST_ORDER, order);
        return order;
      } catch (error) {
        captains.error(error);
        throw new Error(error);
      }
    },
  },
  getters: {
    orders: (state) => state.orders,
  },
};
