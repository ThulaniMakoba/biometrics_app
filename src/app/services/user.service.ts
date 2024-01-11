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
  private apiUrl = 'http://localhost:5111/api/User'

  constructor(private http: HttpClient) { }

  register(request: UserModel): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(`${this.apiUrl}/register`, request);
  }

  verifyUser(request: VerificationRequest): Observable<VerificationResponse> {
    return this.http.post<VerificationResponse>(`${this.apiUrl}/verify-user`, request)
  }

  probeFaceVerification(request: ProbeFaceRequest): Observable<ScoreResponse> {
    return this.http.post<ScoreResponse>(`${this.apiUrl}/probe-face`, request)
  }
}
