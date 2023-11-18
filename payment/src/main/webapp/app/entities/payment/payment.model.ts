export interface IPayment {
  id: number;
  userID?: number | null;
  amount?: number | null;
  status?: string | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
