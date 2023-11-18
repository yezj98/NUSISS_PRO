import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProductListingComponent } from './list/product-listing.component';
import { ProductListingDetailComponent } from './detail/product-listing-detail.component';
import { ProductListingUpdateComponent } from './update/product-listing-update.component';
import { ProductListingDeleteDialogComponent } from './delete/product-listing-delete-dialog.component';
import { ProductListingRoutingModule } from './route/product-listing-routing.module';

@NgModule({
  imports: [SharedModule, ProductListingRoutingModule],
  declarations: [
    ProductListingComponent,
    ProductListingDetailComponent,
    ProductListingUpdateComponent,
    ProductListingDeleteDialogComponent,
  ],
})
export class ProductListingModule {}
