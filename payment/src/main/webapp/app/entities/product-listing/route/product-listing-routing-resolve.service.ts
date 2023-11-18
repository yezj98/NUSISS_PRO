import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductListing } from '../product-listing.model';
import { ProductListingService } from '../service/product-listing.service';

@Injectable({ providedIn: 'root' })
export class ProductListingRoutingResolveService implements Resolve<IProductListing | null> {
  constructor(protected service: ProductListingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductListing | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productListing: HttpResponse<IProductListing>) => {
          if (productListing.body) {
            return of(productListing.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
