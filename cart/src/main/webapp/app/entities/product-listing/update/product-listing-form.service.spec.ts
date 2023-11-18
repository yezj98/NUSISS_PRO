import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../product-listing.test-samples';

import { ProductListingFormService } from './product-listing-form.service';

describe('ProductListing Form Service', () => {
  let service: ProductListingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListingFormService);
  });

  describe('Service methods', () => {
    describe('createProductListingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProductListingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            productName: expect.any(Object),
            quantity: expect.any(Object),
            price: expect.any(Object),
          })
        );
      });

      it('passing IProductListing should create a new form with FormGroup', () => {
        const formGroup = service.createProductListingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            productName: expect.any(Object),
            quantity: expect.any(Object),
            price: expect.any(Object),
          })
        );
      });
    });

    describe('getProductListing', () => {
      it('should return NewProductListing for default ProductListing initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProductListingFormGroup(sampleWithNewData);

        const productListing = service.getProductListing(formGroup) as any;

        expect(productListing).toMatchObject(sampleWithNewData);
      });

      it('should return NewProductListing for empty ProductListing initial value', () => {
        const formGroup = service.createProductListingFormGroup();

        const productListing = service.getProductListing(formGroup) as any;

        expect(productListing).toMatchObject({});
      });

      it('should return IProductListing', () => {
        const formGroup = service.createProductListingFormGroup(sampleWithRequiredData);

        const productListing = service.getProductListing(formGroup) as any;

        expect(productListing).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProductListing should not enable id FormControl', () => {
        const formGroup = service.createProductListingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProductListing should disable id FormControl', () => {
        const formGroup = service.createProductListingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
