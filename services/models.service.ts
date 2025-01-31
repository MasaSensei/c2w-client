import { Model } from "@/types/models";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ModelsService = {
  async getAll() {
    return axios.get(`${API_URL}/models`);
  },

  async create(data: Model) {
    return axios.post(`${API_URL}/models`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Model) {
    return axios.put(`${API_URL}/models/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/models/${id}`);
  },
};
