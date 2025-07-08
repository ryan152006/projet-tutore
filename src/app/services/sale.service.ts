import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = environment.apiUrl + '/sales';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAllSales(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  getSaleById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createSale(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateSale(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
} 