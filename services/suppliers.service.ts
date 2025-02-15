import { Supplier } from "@/types/suppliers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SuppliersService = {
  async getAll() {
    return axios.get(`${API_URL}/suppliers`);
  },

  async create(data: Supplier) {
    return axios.post(`${API_URL}/suppliers`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Supplier) {
    return axios.put(`${API_URL}/suppliers/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/suppliers/${id}`);
  },
};
