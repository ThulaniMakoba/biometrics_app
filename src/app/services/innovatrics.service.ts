import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateCustomerResponse } from "../models/create-customer-response.model";
import { CreateReferenceFaceRequestModel } from "../models/create-reference-face-request.model";
import { CreateReferenceFaceResponse } from "../models/create-reference-face-response.model";
import {CreateReferenceFaceWithoutBackgroundResponse} from "../models/create-reference-face-without-background-response.model"
import { PassiveLivenessSelfieRequestModel } from "../models/passive-liveness-selfie-request.model";
import { ScoreResponse } from "../models/score-response.model";

@Injectable({
    providedIn: 'root'
})

export class InnovatricsService {
    private apiUrl = 'http://localhost:5111/api/Innovatrics'

    constructor(private http: HttpClient) { }

    createCustomer(): Observable<CreateCustomerResponse> {
        return this.http.post<CreateCustomerResponse>(`${this.apiUrl}/innovatrics-create-customer`, null)
    }

    createLiveness(customerId: string): Observable<CreateCustomerResponse> {
        return this.http.put<CreateCustomerResponse>(`${this.apiUrl}/create-liveness/${customerId}`, null);
    }

    generatePassiveLivenessSelfie(customerId: string, request: PassiveLivenessSelfieRequestModel): Observable<unknown> {
        return this.http.post(`${this.apiUrl}/passive-liveness-selfie/${customerId}`, request);
    }

    evaluatePassiveLiveness(customerId: string): Observable<ScoreResponse> {
        return this.http.post<ScoreResponse>(`${this.apiUrl}/evaluate-passive-liveness/${customerId}`, null);
    }

    createReferenceFace(request: CreateReferenceFaceRequestModel): Observable<CreateReferenceFaceResponse> {
        return this.http.post<CreateReferenceFaceResponse>(`${this.apiUrl}/create-reference-face`, request)
    }

    createReferenceFaceWithoutBackground(request: CreateReferenceFaceRequestModel):Observable<CreateReferenceFaceWithoutBackgroundResponse>{
        return this.http.post<CreateReferenceFaceWithoutBackgroundResponse>(`${this.apiUrl}/create-reference-face-with-out-background`, request)
    }
    
}