import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAllProducts(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
