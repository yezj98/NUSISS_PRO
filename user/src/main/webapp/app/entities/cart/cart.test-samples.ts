import { ICart, NewCart } from './cart.model';

export const sampleWithRequiredData: ICart = {
  id: 50053,
};

export const sampleWithPartialData: ICart = {
  id: 97396,
  userID: 2200,
  productID: 12705,
  quantity: 57535,
};

export const sampleWithFullData: ICart = {
  id: 76027,
  userID: 77073,
  productID: 11346,
  quantity: 64900,
};

export const sampleWithNewData: NewCart = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
