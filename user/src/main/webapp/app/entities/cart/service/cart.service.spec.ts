import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICart } from '../cart.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cart.test-samples';

import { CartService } from './cart.service';

const requireRestSample: ICart = {
  ...sampleWithRequiredData,
};

describe('Cart Service', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let expectedResult: ICart | ICart[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Cart', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cart = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cart', () => {
      const cart = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cart).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cart', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cart', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cart', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCartToCollectionIfMissing', () => {
      it('should add a Cart to an empty array', () => {
        const cart: ICart = sampleWithRequiredData;
        expectedResult = service.addCartToCollectionIfMissing([], cart);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cart);
      });

      it('should not add a Cart to an array that contains it', () => {
        const cart: ICart = sampleWithRequiredData;
        const cartCollection: ICart[] = [
          {
            ...cart,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCartToCollectionIfMissing(cartCollection, cart);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cart to an array that doesn't contain it", () => {
        const cart: ICart = sampleWithRequiredData;
        const cartCollection: ICart[] = [sampleWithPartialData];
        expectedResult = service.addCartToCollectionIfMissing(cartCollection, cart);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cart);
      });

      it('should add only unique Cart to an array', () => {
        const cartArray: ICart[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cartCollection: ICart[] = [sampleWithRequiredData];
        expectedResult = service.addCartToCollectionIfMissing(cartCollection, ...cartArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cart: ICart = sampleWithRequiredData;
        const cart2: ICart = sampleWithPartialData;
        expectedResult = service.addCartToCollectionIfMissing([], cart, cart2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cart);
        expect(expectedResult).toContain(cart2);
      });

      it('should accept null and undefined values', () => {
        const cart: ICart = sampleWithRequiredData;
        expectedResult = service.addCartToCollectionIfMissing([], null, cart, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cart);
      });

      it('should return initial array if no Cart is added', () => {
        const cartCollection: ICart[] = [sampleWithRequiredData];
        expectedResult = service.addCartToCollectionIfMissing(cartCollection, undefined, null);
        expect(expectedResult).toEqual(cartCollection);
      });
    });

    describe('compareCart', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCart(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCart(entity1, entity2);
        const compareResult2 = service.compareCart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCart(entity1, entity2);
        const compareResult2 = service.compareCart(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCart(entity1, entity2);
        const compareResult2 = service.compareCart(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
