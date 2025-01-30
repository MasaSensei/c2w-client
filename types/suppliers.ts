export type Supplier = {
  id: number;
  name: string;
  contact: string;
  address: string;
  remarks: string;
  is_active?: number;
};

export type ApiResponse = {
  success: boolean;
  data: Supplier[];
  message: string;
};
