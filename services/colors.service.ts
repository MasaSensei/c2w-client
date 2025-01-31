import { Color } from "@/types/colors";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ColorsService = {
  async getAll() {
    return axios.get(`${API_URL}/colors`);
  },

  async create(data: Color) {
    return axios.post(`${API_URL}/colors`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Color) {
    return axios.put(`${API_URL}/colors/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/colors/${id}`);
  },
};
