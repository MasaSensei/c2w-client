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
  total_yard?: number;
  cost_per_yard?: string;
  remarks?: string;
  is_active?: number;
  color?: Color;
  code?: Code;
};

export type OutgoingBahanBaku = {
  id?: number;
  id_bahan_baku?: number;
  outgoing_date?: string;
  total_roll?: number;
  total_yard?: number;
  status: string;
  incoming_invoice_number?: string;
  remarks?: string;
  is_active?: number;
  bahanbaku?: BahanBaku;
};

export type IncomingResponse = {
  success?: boolean;
  data?: OutgoingBahanBaku[];
  message?: string;
};
