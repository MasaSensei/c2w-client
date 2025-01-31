import { Code } from "@/types/codes";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CodesService = {
  async getAll() {
    return axios.get(`${API_URL}/codes`);
  },

  async create(data: Code) {
    return axios.post(`${API_URL}/codes`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Code) {
    return axios.put(`${API_URL}/codes/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/codes/${id}`);
  },
};
