import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private url = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  checkout(): Observable<Order> {
    return this.http.post<Order>(this.url, {});
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url);
  }
}
