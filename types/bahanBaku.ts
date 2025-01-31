type Category = {
  id: number;
  category: string;
  remarks: string;
  is_active: number;
};

type Code = {
  id: number;
  code: string;
  remarks: string;
  is_active: number;
};

type Color = {
  id: number;
  color: string;
  remarks: string;
  is_active: number;
};
export type BahanBaku = {
  id: number;
  total_roll: number;
  total_yard: string;
  cost_per_yard: string;
  remarks: string;
  is_active: number;
  category: Category[];
  code: Code;
  color: Color;
};

export type ApiResponse = {
  success: boolean;
  data: BahanBaku[];
  message: string;
};
