type Details = {
  id?: number;
  id_inv_cutters_material?: number;
  product_code?: string;
  roll?: number;
  total_yard?: number;
  cost_per_yard?: number;
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
