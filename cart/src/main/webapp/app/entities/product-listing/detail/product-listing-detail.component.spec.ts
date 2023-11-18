import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductListingDetailComponent } from './product-listing-detail.component';

describe('ProductListing Management Detail Component', () => {
  let comp: ProductListingDetailComponent;
  let fixture: ComponentFixture<ProductListingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ productListing: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProductListingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProductListingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load productListing on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.productListing).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
