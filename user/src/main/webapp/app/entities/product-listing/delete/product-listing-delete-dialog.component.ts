import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductListing } from '../product-listing.model';
import { ProductListingService } from '../service/product-listing.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './product-listing-delete-dialog.component.html',
})
export class ProductListingDeleteDialogComponent {
  productListing?: IProductListing;

  constructor(protected productListingService: ProductListingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productListingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
