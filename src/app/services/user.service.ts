import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserModel } from '../models/user-model';
import { CreateCustomerResponse } from '../models/create-customer-response.model';
import { CreateReferenceFaceRequestModel } from '../models/create-reference-face-request.model';
import { CreateReferenceFaceResponse } from '../models/create-reference-face-response.model';
import { VerificationRequest } from '../models/verify-user-request.model';
import { VerificationResponse } from '../models/verification-response.model';
import { ProbeFaceRequest } from '../models/probe-face-request.model';

import { PassiveLivenessSelfieRequestModel } from '../models/passive-liveness-selfie-request.model';
import { ScoreResponse } from '../models/score-response.model';
import { RegisterUserResponse } from '../models/register-user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:59414/api/User'

  constructor(private http: HttpClient) { }

  // createCustomer(): Observable<CreateCustomerResponse> {
  //   return this.http.post<CreateCustomerResponse>(`${this.apiUrl}/innovatrics-create-customer`, null)
  // }

  // createLiveness(customerId: string): Observable<CreateCustomerResponse> {
  //   return this.http.put<CreateCustomerResponse>(`${this.apiUrl}/create-liveness/${customerId}`, null);
  // }

  // generatePassiveLivenessSelfie(customerId: string, request: PassiveLivenessSelfieRequestModel): Observable<unknown> {
  //   return this.http.post(`${this.apiUrl}/passive-liveness-selfie/${customerId}`, request);
  // }

  // evaluatePassiveLiveness(customerId: string): Observable<ScoreResponse> {
  //   return this.http.post<ScoreResponse>(`${this.apiUrl}/evaluate-passive-liveness/${customerId}`, null);
  // }

  register(request: UserModel): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(`${this.apiUrl}/register`, request);
  }

  // createReferenceFace(request: CreateReferenceFaceRequestModel): Observable<CreateReferenceFaceResponse> {
  //   return this.http.post<CreateReferenceFaceResponse>(`${this.apiUrl}/innovatrics-create-reference-face`, request)
  // }

  verifyUser(request: VerificationRequest): Observable<VerificationResponse> {
    return this.http.post<VerificationResponse>(`${this.apiUrl}/verify-user`, request)
  }

  probeFaceVerification(request: ProbeFaceRequest): Observable<ScoreResponse> {
    return this.http.post<ScoreResponse>(`${this.apiUrl}/innovatrics-probe-face`, request)
  }
}
