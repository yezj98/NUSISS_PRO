export interface IProductListing {
  id: number;
  productName?: string | null;
  quantity?: number | null;
  price?: number | null;
}

export type NewProductListing = Omit<IProductListing, 'id'> & { id: null };
