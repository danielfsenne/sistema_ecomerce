import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Product } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(name?: string, categoryId?: number, page = 0, size = 12): Observable<Page<Product>> {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'name,asc');
    if (name) params = params.set('name', name);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<Page<Product>>(this.url, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(data: FormData): Observable<Product> {
    return this.http.post<Product>(this.url, data);
  }

  createJson(data: object): Observable<Product> {
    return this.http.post<Product>(this.url, data);
  }

  update(id: number, data: object): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  uploadImage(id: number, file: File): Observable<Product> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Product>(`${this.url}/${id}/image`, form);
  }
}
