import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProductListingFormService, ProductListingFormGroup } from './product-listing-form.service';
import { IProductListing } from '../product-listing.model';
import { ProductListingService } from '../service/product-listing.service';

@Component({
  selector: 'jhi-product-listing-update',
  templateUrl: './product-listing-update.component.html',
})
export class ProductListingUpdateComponent implements OnInit {
  isSaving = false;
  productListing: IProductListing | null = null;

  editForm: ProductListingFormGroup = this.productListingFormService.createProductListingFormGroup();

  constructor(
    protected productListingService: ProductListingService,
    protected productListingFormService: ProductListingFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productListing }) => {
      this.productListing = productListing;
      if (productListing) {
        this.updateForm(productListing);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productListing = this.productListingFormService.getProductListing(this.editForm);
    if (productListing.id !== null) {
      this.subscribeToSaveResponse(this.productListingService.update(productListing));
    } else {
      this.subscribeToSaveResponse(this.productListingService.create(productListing));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductListing>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(productListing: IProductListing): void {
    this.productListing = productListing;
    this.productListingFormService.resetForm(this.editForm, productListing);
  }
}
