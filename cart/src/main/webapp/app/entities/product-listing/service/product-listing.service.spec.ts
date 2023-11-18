import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductListing } from '../product-listing.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../product-listing.test-samples';

import { ProductListingService } from './product-listing.service';

const requireRestSample: IProductListing = {
  ...sampleWithRequiredData,
};

describe('ProductListing Service', () => {
  let service: ProductListingService;
  let httpMock: HttpTestingController;
  let expectedResult: IProductListing | IProductListing[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProductListingService);
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

    it('should create a ProductListing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const productListing = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(productListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProductListing', () => {
      const productListing = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(productListing).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProductListing', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProductListing', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProductListing', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProductListingToCollectionIfMissing', () => {
      it('should add a ProductListing to an empty array', () => {
        const productListing: IProductListing = sampleWithRequiredData;
        expectedResult = service.addProductListingToCollectionIfMissing([], productListing);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productListing);
      });

      it('should not add a ProductListing to an array that contains it', () => {
        const productListing: IProductListing = sampleWithRequiredData;
        const productListingCollection: IProductListing[] = [
          {
            ...productListing,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProductListingToCollectionIfMissing(productListingCollection, productListing);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProductListing to an array that doesn't contain it", () => {
        const productListing: IProductListing = sampleWithRequiredData;
        const productListingCollection: IProductListing[] = [sampleWithPartialData];
        expectedResult = service.addProductListingToCollectionIfMissing(productListingCollection, productListing);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productListing);
      });

      it('should add only unique ProductListing to an array', () => {
        const productListingArray: IProductListing[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const productListingCollection: IProductListing[] = [sampleWithRequiredData];
        expectedResult = service.addProductListingToCollectionIfMissing(productListingCollection, ...productListingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const productListing: IProductListing = sampleWithRequiredData;
        const productListing2: IProductListing = sampleWithPartialData;
        expectedResult = service.addProductListingToCollectionIfMissing([], productListing, productListing2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(productListing);
        expect(expectedResult).toContain(productListing2);
      });

      it('should accept null and undefined values', () => {
        const productListing: IProductListing = sampleWithRequiredData;
        expectedResult = service.addProductListingToCollectionIfMissing([], null, productListing, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(productListing);
      });

      it('should return initial array if no ProductListing is added', () => {
        const productListingCollection: IProductListing[] = [sampleWithRequiredData];
        expectedResult = service.addProductListingToCollectionIfMissing(productListingCollection, undefined, null);
        expect(expectedResult).toEqual(productListingCollection);
      });
    });

    describe('compareProductListing', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProductListing(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProductListing(entity1, entity2);
        const compareResult2 = service.compareProductListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProductListing(entity1, entity2);
        const compareResult2 = service.compareProductListing(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProductListing(entity1, entity2);
        const compareResult2 = service.compareProductListing(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
