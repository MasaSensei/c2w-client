type Size = {
  id?: number;
  size?: string;
  remarks?: string;
  is_active?: number;
};

type Model = {
  id?: number;
  model?: string;
  remarks?: string;
  is_active?: number;
};

type Category = {
  id?: number;
  category?: string | number;
  remarks?: string;
  is_active?: number;
  pivot?: {
    id_inv_cutters_material?: number;
    id_item_category?: number;
  };
};

export type InventoryBahanBakuToCutters = {
  id?: number;
  id_bahan_baku?: number;
  transfer_date?: string;
  item?: string;
  total_roll?: number;
  total_yard?: number;
  status?: string;
  remarks?: string;
  is_active?: number;
  category?: Category[];
  size?: Size;
  model?: Model;
};
