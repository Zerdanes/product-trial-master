/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from './product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch paged products with correct params', (done: DoneFn) => {
    const mockResp = {
      items: [
        {
          id: 1,
          code: 'P-1',
          name: 'Test Product',
          description: 'desc',
          image: '',
          category: 'cat',
          price: 9.99,
          quantity: 5,
          internalReference: '',
          shellId: 0,
          inventoryStatus: 'INSTOCK',
          rating: 0,
          createdAt: 0,
          updatedAt: 0
        } as Product
      ],
      total: 1,
      page: 0,
      size: 10
    };

    service.getPaged(0, 10, 'test', 'cat').subscribe(resp => {
      expect(resp.total).toBe(1);
      expect(resp.items.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url.includes('/api/products'));
    expect(req.request.params.get('page')).toBe('0');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('q')).toBe('test');
    expect(req.request.params.get('category')).toBe('cat');
    req.flush(mockResp);
  });
});
