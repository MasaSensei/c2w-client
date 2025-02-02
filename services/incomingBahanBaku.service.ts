import { IncomingBahanBaku } from "@/types/incomingBahanBaku";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const IncomingBahanBakuService = {
  async getAll() {
    return axios.get(`${API_URL}/incoming-bahan-baku`);
  },

  async getOne(id: string) {
    return axios.get(`${API_URL}/incoming-bahan-baku/${id}`);
  },

  async create(data: IncomingBahanBaku) {
    return axios.post(`${API_URL}/incoming-bahan-baku`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: IncomingBahanBaku) {
    return axios.put(`${API_URL}/incoming-bahan-baku/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/incoming-bahan-baku/${id}`);
  },
};
