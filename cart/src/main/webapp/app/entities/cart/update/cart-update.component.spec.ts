import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CartFormService } from './cart-form.service';
import { CartService } from '../service/cart.service';
import { ICart } from '../cart.model';

import { CartUpdateComponent } from './cart-update.component';

describe('Cart Management Update Component', () => {
  let comp: CartUpdateComponent;
  let fixture: ComponentFixture<CartUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cartFormService: CartFormService;
  let cartService: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CartUpdateComponent],
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
      .overrideTemplate(CartUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CartUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cartFormService = TestBed.inject(CartFormService);
    cartService = TestBed.inject(CartService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cart: ICart = { id: 456 };

      activatedRoute.data = of({ cart });
      comp.ngOnInit();

      expect(comp.cart).toEqual(cart);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICart>>();
      const cart = { id: 123 };
      jest.spyOn(cartFormService, 'getCart').mockReturnValue(cart);
      jest.spyOn(cartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cart }));
      saveSubject.complete();

      // THEN
      expect(cartFormService.getCart).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cartService.update).toHaveBeenCalledWith(expect.objectContaining(cart));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICart>>();
      const cart = { id: 123 };
      jest.spyOn(cartFormService, 'getCart').mockReturnValue({ id: null });
      jest.spyOn(cartService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cart: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cart }));
      saveSubject.complete();

      // THEN
      expect(cartFormService.getCart).toHaveBeenCalled();
      expect(cartService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICart>>();
      const cart = { id: 123 };
      jest.spyOn(cartService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cart });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cartService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
