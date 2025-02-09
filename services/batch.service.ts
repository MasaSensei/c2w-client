import { Batch } from "@/types/batch";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const BatchService = {
  async getAll({ type }: { type: string }) {
    return axios.get(`${API_URL}/batches?reference_type=${type}`);
  },

  async getOne(id: number) {
    return axios.get(`${API_URL}/batches/${id}`);
  },

  async create(data: Batch) {
    return axios.post(`${API_URL}/batches`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Worker) {
    return axios.put(`${API_URL}/batches/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/batches/${id}`);
  },
};
