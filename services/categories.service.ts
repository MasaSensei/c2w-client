import { Category } from "@/types/category";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const CategoriesService = {
  async getAll() {
    return axios.get(`${API_URL}/categories`);
  },

  async create(data: Category) {
    return axios.post(`${API_URL}/categories`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Category) {
    return axios.put(`${API_URL}/categories/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/categories/${id}`);
  },
};
