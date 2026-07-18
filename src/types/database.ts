export interface Product {
  id: string;
  name: string;
  price: number;
  serial: string;
  image_url: string;
  car_model: string | null;
  year: number | null;
  stock: number;
  created_at: string;
}

export interface SalesLog {
  id: string;
  product_id: string;
  quantity: number;
  sold_at: string;
  snapshot_name: string;
  snapshot_price: number;
  snapshot_serial: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  serial: string;
  image_url: string;
  car_model: string;
  year: string;
  stock: number;
}
