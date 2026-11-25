export interface PublicPriceCategory {
  name: string;
  slug: string;
  count: number;
}

export interface PublicPriceItem {
  id: number;
  product_id: number;
  product_name: string;
  image_url: string | null;
  category: string;
  category_slug: string;
  variant_name: string;
  variant_group: string;
  duration: string;
  duration_months: number | null;
  desc: string;
  price: number;
  promo_price: number | null;
}

export interface PublicPriceListResponse {
  success: boolean;
  categories: PublicPriceCategory[];
  items: PublicPriceItem[];
  total: number;
  updated_at?: string;
  error?: string;
  message?: string;
}
