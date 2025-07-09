import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getFinanceReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/finance`, this.getAuthHeaders());
  }

  getSalesReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/sales`, this.getAuthHeaders());
  }

  getClientsReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/clients`, this.getAuthHeaders());
  }

  getDashboardReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/dashboard`, this.getAuthHeaders());
  }
} 