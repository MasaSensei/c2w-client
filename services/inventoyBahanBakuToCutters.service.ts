import { InventoryBahanBakuToCutters } from "@/types/inventoryBahanBakuToCutters";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const InventoryBahanBakuToCuttersService = {
  async getAll() {
    return axios.get(`${API_URL}/inventory-bahan-baku-to-cutters`);
  },

  async getOne(id: string) {
    return axios.get(`${API_URL}/inventory-bahan-baku-to-cutters/${id}`);
  },

  async create(data: InventoryBahanBakuToCutters) {
    return axios.post(`${API_URL}/inventory-bahan-baku-to-cutters`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: InventoryBahanBakuToCutters) {
    return axios.put(`${API_URL}/inventory-bahan-baku-to-cutters/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/inventory-bahan-baku-to-cutters/${id}`);
  },
};
