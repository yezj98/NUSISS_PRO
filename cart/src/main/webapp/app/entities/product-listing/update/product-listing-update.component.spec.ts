import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductListingFormService } from './product-listing-form.service';
import { ProductListingService } from '../service/product-listing.service';
import { IProductListing } from '../product-listing.model';

import { ProductListingUpdateComponent } from './product-listing-update.component';

describe('ProductListing Management Update Component', () => {
  let comp: ProductListingUpdateComponent;
  let fixture: ComponentFixture<ProductListingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productListingFormService: ProductListingFormService;
  let productListingService: ProductListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductListingUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProductListingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductListingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productListingFormService = TestBed.inject(ProductListingFormService);
    productListingService = TestBed.inject(ProductListingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const productListing: IProductListing = { id: 456 };

      activatedRoute.data = of({ productListing });
      comp.ngOnInit();

      expect(comp.productListing).toEqual(productListing);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductListing>>();
      const productListing = { id: 123 };
      jest.spyOn(productListingFormService, 'getProductListing').mockReturnValue(productListing);
      jest.spyOn(productListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productListing }));
      saveSubject.complete();

      // THEN
      expect(productListingFormService.getProductListing).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productListingService.update).toHaveBeenCalledWith(expect.objectContaining(productListing));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductListing>>();
      const productListing = { id: 123 };
      jest.spyOn(productListingFormService, 'getProductListing').mockReturnValue({ id: null });
      jest.spyOn(productListingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productListing: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: productListing }));
      saveSubject.complete();

      // THEN
      expect(productListingFormService.getProductListing).toHaveBeenCalled();
      expect(productListingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProductListing>>();
      const productListing = { id: 123 };
      jest.spyOn(productListingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ productListing });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productListingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
