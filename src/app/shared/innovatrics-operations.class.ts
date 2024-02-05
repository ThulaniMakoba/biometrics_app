import { Observable, Subject } from "rxjs";
import { CreateCustomerResponse } from "../models/create-customer-response.model";
import { PassiveLivenessSelfieRequestModel } from "../models/passive-liveness-selfie-request.model";
import { jpegBase64ToStringBase64 } from "../utils/helpers";
import { InnovatricsService } from "../services/innovatrics.service";
import { Injectable } from "@angular/core";
import { AlertService } from "../services/alert.service";

@Injectable({
    providedIn: 'root'
})

export class InnovatricsOperations {

    constructor(private innovatricsService: InnovatricsService, private alertService: AlertService) { }

    passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();

    createCustomer(): Observable<string | undefined> {
        const result: Subject<string | undefined> = new Subject<string | undefined>();

        this.innovatricsService.createCustomer().subscribe({
            next: (response: CreateCustomerResponse) => {
                return result.next(response.id);
            },
            error: (error) => {
                this.alertService.error('Innovatrics Integration error :', error);
                return result.next(undefined);
            }
        })
        return result;
    }

    createLiveness(customerId: string): Observable<boolean> {
        const result: Subject<boolean> = new Subject<boolean>();

        this.innovatricsService.createLiveness(customerId).subscribe({
            next: (response: CreateCustomerResponse) => {
                result.next(true);
            },
            error: (error) => {
                this.alertService.error('Error create liveness:', error);
                result.next(false);
            }
        })
        return result;
    }

    generatePassiveLivenessSelfie(image: unknown, customerId: string): Observable<string | undefined> {
        const face: Subject<string | undefined> = new Subject<string | undefined>();

        this.passiveLivenessSelfieModel.image.Data = jpegBase64ToStringBase64(image);

        this.innovatricsService.generatePassiveLivenessSelfie(customerId, this.passiveLivenessSelfieModel).subscribe({
            next: (_) => {
                face.next(jpegBase64ToStringBase64(image));
            },
            error: (error) => {
                face.next(undefined);
                this.alertService.error('Error Generating Passive Liveness Selfie:', error)
            }
        })

        return face;
    }

    evaluatePassiveLiveness(customerId: string): Observable<boolean> {
        const success: Subject<boolean> = new Subject<boolean>();
        this.innovatricsService.evaluatePassiveLiveness(customerId).subscribe({
            next: (response) => {
                const score: number = +response.score;
                //This code should be move to the backend
                if (score < 0.89) {
                    this.alertService.error(`Failed Liveness: score value: ${score} `)
                    success.next(false);
                } else {
                    success.next(true)
                    // this.createReferenceFace(this.photoImage); this belongs to user-registration component
                }
            },
            error: (error) => {
                this.alertService.error('Error Evaluating Passive Liveness:', error);
            }
        })

        return success;
    }
}