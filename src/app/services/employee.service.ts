import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  createEmployee(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, this.getAuthHeaders());
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
} 