type Material = {
  material_category?: string;
  price_per_yard?: number;
};

type WorkerType = {
  worker_type?: string;
  min_cost?: number;
  is_active?: boolean;
  materials?: Material[];
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
};

export type ApiResponse = {
  success?: boolean;
  data?: Worker[];
  message?: string;
};
