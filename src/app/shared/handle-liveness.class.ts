import { Observable, Subject } from "rxjs";
import { CreateCustomerResponse } from "../models/create-customer-response.model";
import { PassiveLivenessSelfieRequestModel } from "../models/passive-liveness-selfie-request.model";
import { UserService } from "../services/user.service";
import { jpegBase64ToStringBase64 } from "../utils/helpers";

export class HandleLiveness {

    constructor(private userService: UserService) { }
    
    customerId: string = '';
    photoImage: string = '';
    passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();

    createCustomer(): void {
        this.userService.createCustomer().subscribe({
            next: (response: CreateCustomerResponse) => {
                this.createLiveness(response.id)
            },
            complete: () => {
            },
            error: (error) => {
                console.error('Error create customer:', error);
            }
        })
    }

    createLiveness(customerId: string): Observable<boolean> {
        const result: Subject<boolean> = new Subject<boolean>();

        this.userService.createLiveness(customerId).subscribe({
            next: (response: CreateCustomerResponse) => {
                // this.canDisplayCamera = true; this belongs to user-registration component
                this.customerId = customerId;
                result.next(true);
            },
            error: (error) => {
                console.error('Error create liveness:', error);
                result.next(false);
            }
        })

        return result;
    }

    generatePassiveLivenessSelfie(image: unknown) {
        this.photoImage = jpegBase64ToStringBase64(image);
        this.passiveLivenessSelfieModel.image.Data = this.photoImage;
        this.userService.generatePassiveLivenessSelfie(this.customerId, this.passiveLivenessSelfieModel).subscribe({
            next: (_) => {
                this.evaluatePassiveLiveness();
            },
            error: (error) => {
                console.error('Error Generating Passive Liveness Selfie:', error);
            }
        })
    }

    evaluatePassiveLiveness(): Observable<string> {
        const result: Subject<string> = new Subject<string>();
        this.userService.evaluatePassiveLiveness(this.customerId).subscribe({
            next: (response) => {
                const score: number = +response.score;

                if (score < 0.89) {
                    alert("Fail Liveness")
                    return;
                }
                result.next(this.photoImage)
                // this.createReferenceFace(this.photoImage); this belongs to user-registration component
            },
            error: (error) => {
                console.error('Error Evaluating Passive Liveness:', error);
            }
        })

        return result;
    }
}