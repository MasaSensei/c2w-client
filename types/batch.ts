type Detail = {
  id?: number;
  product_code?: string;
  batch_number?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  quantity?: number;
  remarks?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Batch = {
  batch_number?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  quantity?: number;
  remarks?: string;
  is_active?: boolean;
  updated_at?: string;
  created_at?: string;
  id?: number;
  details?: Detail[];
};
