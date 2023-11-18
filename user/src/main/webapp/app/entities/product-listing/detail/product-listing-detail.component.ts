import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductListing } from '../product-listing.model';

@Component({
  selector: 'jhi-product-listing-detail',
  templateUrl: './product-listing-detail.component.html',
})
export class ProductListingDetailComponent implements OnInit {
  productListing: IProductListing | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productListing }) => {
      this.productListing = productListing;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
