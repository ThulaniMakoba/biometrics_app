import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserModel } from '../models/user-model';
import { CreateCustomerResponse } from '../models/create-customer-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:59414/api/User'

  constructor(private http: HttpClient) { }

  createCustomer(): Observable<CreateCustomerResponse> {
    return this.http.post<CreateCustomerResponse>(`${this.apiUrl}/innovatrics-create-customer`,null)   
    // .pipe(
    //   catchError((error) => {
    //     console.error('Error:', error);
    //     return throwError('An error occurred while processing your request.');
    //   }));
}

  register(request: UserModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }
}
