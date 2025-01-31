export type Category = {
  id?: number;
  category: string;
  remarks: string;
  is_active?: number;
};

export type ApiResponse = {
  success: boolean;
  data: Category[];
  message: string;
};
