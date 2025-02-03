import { Worker } from "@/types/workers";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const WorkerService = {
  async getAll({ type }: { type: string }) {
    return axios.get(`${API_URL}/workers?type=${type}`);
  },

  async create(data: Worker) {
    return axios.post(`${API_URL}/workers`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async update(id: number, data: Worker) {
    return axios.put(`${API_URL}/workers/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  async delete(id: number) {
    return axios.delete(`${API_URL}/workers/${id}`);
  },
};
