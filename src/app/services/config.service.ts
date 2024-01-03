import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComputerConfigResponse } from '../models/computer-config-response.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = 'https://ednaliteapi.azurewebsites.net/api/Config'

  constructor(private http: HttpClient) { }

  fetchComputerSidNumber(): Observable<ComputerConfigResponse> {
    return this.http.get<ComputerConfigResponse>(`${this.apiUrl}/computer-motherboard`);
  }

}
