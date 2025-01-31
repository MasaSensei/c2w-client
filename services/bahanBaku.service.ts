import { BahanBaku } from "@/types/bahanBaku";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BahanBakuService = {
  async getAll() {
    return axios.get(`${API_URL}/bahan-baku`);
  },

  async create(data: BahanBaku) {
    return axios.post(`${API_URL}/bahan-baku`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: BahanBaku) {
    return axios.put(`${API_URL}/bahan-baku/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/bahan-baku/${id}`);
  },
};
