import { IProductListing, NewProductListing } from './product-listing.model';

export const sampleWithRequiredData: IProductListing = {
  id: 74985,
};

export const sampleWithPartialData: IProductListing = {
  id: 24699,
  quantity: 38637,
};

export const sampleWithFullData: IProductListing = {
  id: 52978,
  productName: 'Avon Island',
  quantity: 46427,
  price: 53942,
};

export const sampleWithNewData: NewProductListing = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
