import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = environment.apiUrl + '/suppliers';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAllSuppliers(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  getSupplierById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createSupplier(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateSupplier(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteSupplier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
} 