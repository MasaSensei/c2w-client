type Details = {
  id?: number;
  id_inv_cutters_material?: number;
  product_code?: string;
  roll?: number;
  total_yard?: number;
  cost_per_yard?: number;
  sub_total?: number;
  status?: string;
  remarks?: string;
  inventory_bahan_baku_to_cutters?: {
    status: string;
  };
};

export type OrderToCutters = {
  id?: number;
  invoice_number?: string;
  order_date?: string;
  due_date?: string;
  remarks?: string;
  is_active?: boolean;
  status: string;
  details?: Details[];
};
