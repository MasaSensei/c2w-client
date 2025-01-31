export type Color = {
  id?: number;
  color: string;
  remarks: string;
  is_active?: number;
};

export type ApiResponse = {
  success: boolean;
  data: Color[];
  message: string;
};
