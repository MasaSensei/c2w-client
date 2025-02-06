import { OrderToCutters } from "@/types/orderToCutters";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const OrderToCuttersService = {
  async getAll() {
    return axios.get(`${API_URL}/orders-to-cutters`);
  },

  async getOne(id: string) {
    return axios.get(`${API_URL}/orders-to-cutters/${id}`);
  },

  async create(data: OrderToCutters) {
    return axios.post(`${API_URL}/orders-to-cutters`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: OrderToCutters) {
    return axios.put(`${API_URL}/orders-to-cutters/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/orders-to-cutters/${id}`);
  },
};
