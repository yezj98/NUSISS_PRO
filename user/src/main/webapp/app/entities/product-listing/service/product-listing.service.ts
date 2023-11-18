import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductListing, NewProductListing } from '../product-listing.model';

export type PartialUpdateProductListing = Partial<IProductListing> & Pick<IProductListing, 'id'>;

export type EntityResponseType = HttpResponse<IProductListing>;
export type EntityArrayResponseType = HttpResponse<IProductListing[]>;

@Injectable({ providedIn: 'root' })
export class ProductListingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/product-listings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(productListing: NewProductListing): Observable<EntityResponseType> {
    return this.http.post<IProductListing>(this.resourceUrl, productListing, { observe: 'response' });
  }

  update(productListing: IProductListing): Observable<EntityResponseType> {
    return this.http.put<IProductListing>(`${this.resourceUrl}/${this.getProductListingIdentifier(productListing)}`, productListing, {
      observe: 'response',
    });
  }

  partialUpdate(productListing: PartialUpdateProductListing): Observable<EntityResponseType> {
    return this.http.patch<IProductListing>(`${this.resourceUrl}/${this.getProductListingIdentifier(productListing)}`, productListing, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductListing>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductListing[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProductListingIdentifier(productListing: Pick<IProductListing, 'id'>): number {
    return productListing.id;
  }

  compareProductListing(o1: Pick<IProductListing, 'id'> | null, o2: Pick<IProductListing, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductListingIdentifier(o1) === this.getProductListingIdentifier(o2) : o1 === o2;
  }

  addProductListingToCollectionIfMissing<Type extends Pick<IProductListing, 'id'>>(
    productListingCollection: Type[],
    ...productListingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const productListings: Type[] = productListingsToCheck.filter(isPresent);
    if (productListings.length > 0) {
      const productListingCollectionIdentifiers = productListingCollection.map(
        productListingItem => this.getProductListingIdentifier(productListingItem)!
      );
      const productListingsToAdd = productListings.filter(productListingItem => {
        const productListingIdentifier = this.getProductListingIdentifier(productListingItem);
        if (productListingCollectionIdentifiers.includes(productListingIdentifier)) {
          return false;
        }
        productListingCollectionIdentifiers.push(productListingIdentifier);
        return true;
      });
      return [...productListingsToAdd, ...productListingCollection];
    }
    return productListingCollection;
  }
}
