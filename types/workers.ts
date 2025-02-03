type Prices = {
  material_category?: string;
  min_cost?: string;
  cost_per_yard?: string;
};

type WorkerType = {
  worker_type?: string;
  min_cost?: number;
  is_active?: boolean;
};

export type Worker = {
  id?: number;
  name?: string;
  contact?: string;
  address?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  worker_types?: WorkerType[];
  prices?: Prices[];
  min_cost?: string;
  type?: string;
};

export type ApiResponse = {
  success?: boolean;
  data?: Worker[];
  message?: string;
};
