type OrderBahanBaku = {
  id?: number;
  invoice_number?: string;
  order_date?: string;
  due_date?: string;
  status?: string;
  remarks?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

type Reference = {
  id?: number;
  id_order_bahan_baku?: number;
  id_inv_cutters_material?: number;
  product_code?: string;
  roll?: number;
  total_yard?: string;
  cost_per_yard?: string;
  sub_total?: string;
  remarks?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  order_bahan_baku?: OrderBahanBaku;
};

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
  reference?: Reference;
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
