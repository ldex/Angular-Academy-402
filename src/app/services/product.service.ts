import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, delay, shareReplay, tap, map } from 'rxjs';
import { Product } from '../models/product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  public products$: Observable<Product[]>;

  constructor() {
    this.initProducts();
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  getProductById(id: number) {
    return this
              .products$
              .pipe(
                map(products => products.find(product => product.id == id))
              )
  }

  initProducts() {
    let url:string = this.baseUrl + '?_sort=modifiedDate&_order=desc';
    this.products$ = this
                        .http
                        .get<Product[]>(url)
                        .pipe(
                          delay(1500), // for demo!
                          tap(console.table),
                          shareReplay()
                        );
  }

  resetCache() {
    this.initProducts()
  }

}