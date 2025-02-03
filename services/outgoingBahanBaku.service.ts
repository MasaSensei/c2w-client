import { OutgoingBahanBaku } from "@/types/outgoingBahanBaku";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const OutgoingBahanBakuService = {
  async getAll() {
    return axios.get(`${API_URL}/outgoing-bahan-baku`);
  },

  async getOne(id: string) {
    return axios.get(`${API_URL}/outgoing-bahan-baku/${id}`);
  },

  async create(data: OutgoingBahanBaku) {
    return axios.post(`${API_URL}/outgoing-bahan-baku`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: OutgoingBahanBaku) {
    return axios.put(`${API_URL}/outgoing-bahan-baku/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/outgoing-bahan-baku/${id}`);
  },
};
