type Code = {
  id: number;
  code?: string;
  remarks?: string;
  is_active?: number;
};

type Color = {
  id: number;
  color?: string;
  remarks?: string;
  is_active?: number;
};
export type BahanBaku = {
  id: number;
  id_code: number;
  id_color: number;
  item: string;
  total_roll?: number;
  total_yard?: number;
  cost_per_yard?: number;
  remarks: string;
  is_active: number;
  code: Code;
  color: Color;
};

export type ApiResponse = {
  success: boolean;
  data: BahanBaku[];
  message: string;
};
