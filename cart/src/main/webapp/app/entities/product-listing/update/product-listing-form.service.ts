import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProductListing, NewProductListing } from '../product-listing.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProductListing for edit and NewProductListingFormGroupInput for create.
 */
type ProductListingFormGroupInput = IProductListing | PartialWithRequiredKeyOf<NewProductListing>;

type ProductListingFormDefaults = Pick<NewProductListing, 'id'>;

type ProductListingFormGroupContent = {
  id: FormControl<IProductListing['id'] | NewProductListing['id']>;
  productName: FormControl<IProductListing['productName']>;
  quantity: FormControl<IProductListing['quantity']>;
  price: FormControl<IProductListing['price']>;
};

export type ProductListingFormGroup = FormGroup<ProductListingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductListingFormService {
  createProductListingFormGroup(productListing: ProductListingFormGroupInput = { id: null }): ProductListingFormGroup {
    const productListingRawValue = {
      ...this.getFormDefaults(),
      ...productListing,
    };
    return new FormGroup<ProductListingFormGroupContent>({
      id: new FormControl(
        { value: productListingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      productName: new FormControl(productListingRawValue.productName),
      quantity: new FormControl(productListingRawValue.quantity),
      price: new FormControl(productListingRawValue.price),
    });
  }

  getProductListing(form: ProductListingFormGroup): IProductListing | NewProductListing {
    return form.getRawValue() as IProductListing | NewProductListing;
  }

  resetForm(form: ProductListingFormGroup, productListing: ProductListingFormGroupInput): void {
    const productListingRawValue = { ...this.getFormDefaults(), ...productListing };
    form.reset(
      {
        ...productListingRawValue,
        id: { value: productListingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductListingFormDefaults {
    return {
      id: null,
    };
  }
}
