import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { EnrolRequestModel, EnrollModel } from '../models/enroll-model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:59414/api/Enrollment'

  constructor(private http: HttpClient) { }

  enrol(
    // request: EnrolRequestModel
    request: EnrollModel
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}`, request);
  }
}
