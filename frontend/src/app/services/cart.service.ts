import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private url = `${environment.apiUrl}/cart`;
  private cart$ = new BehaviorSubject<Cart | null>(null);

  constructor(private http: HttpClient) {}

  get cartState$(): Observable<Cart | null> {
    return this.cart$.asObservable();
  }

  load(): Observable<Cart> {
    return this.http.get<Cart>(this.url).pipe(tap(c => this.cart$.next(c)));
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.url}/add`, { productId, quantity }).pipe(
      tap(c => this.cart$.next(c))
    );
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.url}/item/${itemId}`).pipe(
      tap(c => this.cart$.next(c))
    );
  }

  clear(): void {
    this.cart$.next(null);
  }
}
