import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductListingComponent } from '../list/product-listing.component';
import { ProductListingDetailComponent } from '../detail/product-listing-detail.component';
import { ProductListingUpdateComponent } from '../update/product-listing-update.component';
import { ProductListingRoutingResolveService } from './product-listing-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const productListingRoute: Routes = [
  {
    path: '',
    component: ProductListingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductListingDetailComponent,
    resolve: {
      productListing: ProductListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductListingUpdateComponent,
    resolve: {
      productListing: ProductListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductListingUpdateComponent,
    resolve: {
      productListing: ProductListingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productListingRoute)],
  exports: [RouterModule],
})
export class ProductListingRoutingModule {}
