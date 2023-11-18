import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: 47537,
};

export const sampleWithPartialData: IPayment = {
  id: 34993,
  userID: 88670,
  amount: 46452,
};

export const sampleWithFullData: IPayment = {
  id: 39655,
  userID: 28713,
  amount: 32065,
  status: 'withdrawal Investor',
};

export const sampleWithNewData: NewPayment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
