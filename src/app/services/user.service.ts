import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { VerificationRequest } from '../models/verify-user-request.model';
import { VerificationResponse } from '../models/verification-response.model';
import { ProbeFaceRequest } from '../models/probe-face-request.model';

import { RegisterUserResponse } from '../models/register-user-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/User'

  constructor(private http: HttpClient) { }

  register(request: UserModel): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(`${this.apiUrl}/register`, request);
  }

  probeFaceVerification(request: ProbeFaceRequest): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/probe-face`, request)
  }
}
