type Color = {
  id?: number;
  color?: string;
  remarks?: string;
  is_active?: boolean;
};

type Code = {
  id?: number;
  code?: string;
  remarks?: string;
  is_active?: boolean;
};

type BahanBaku = {
  id?: number;
  id_code?: number;
  id_color?: number;
  item?: string;
  total_roll?: number;
  total_yard?: string;
  cost_per_yard?: string;
  remarks?: string;
  is_active?: number;
  color?: Color;
  code?: Code;
};

type Detail = {
  id?: number;
  id_incoming_bahan_baku?: number;
  id_bahan_baku?: number;
  length_yard?: number | null;
  roll?: number;
  total_yard?: number | null;
  cost_per_yard?: number | null;
  sub_total?: number | null;
  remarks?: string | null;
  is_active?: number;
  bahan_baku?: BahanBaku;
};

type Supplier = {
  id?: number;
  name?: string;
  contact?: string;
  address?: string;
  remarks?: string;
  is_active?: boolean;
};

export type IncomingBahanBaku = {
  id?: number;
  id_supplier?: number;
  invoice_number?: string;
  invoice_date?: string;
  is_active?: number;
  suppliers?: Supplier;
  details?: Detail[];
};

export type IncomingResponse = {
  success?: boolean;
  data?: IncomingBahanBaku[];
  message?: string;
};
