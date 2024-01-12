import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateCustomerResponse } from 'src/app/models/create-customer-response.model';
import { PassiveLivenessSelfieRequestModel } from 'src/app/models/passive-liveness-selfie-request.model';
import { ProbeFaceRequest } from 'src/app/models/probe-face-request.model';
import { ScoreResponse } from 'src/app/models/score-response.model';
import { VerificationResponse } from 'src/app/models/verification-response.model';
import { VerificationRequest } from 'src/app/models/verify-user-request.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { InnovatricsService } from 'src/app/services/innovatrics.service';
import { UserService } from 'src/app/services/user.service';
import { OnPhotoTakenEventValue } from 'src/app/types';
import { blobToBase64, jpegBase64ToStringBase64 } from 'src/app/utils/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private innovatricsService: InnovatricsService,
    private alertService: AlertService
  ) { }

  showCamera: boolean = false;
  showMessage: boolean = false;
  imageUrl = '';
  probeFaceRequest: ProbeFaceRequest = new ProbeFaceRequest();
  referenceFaceId: string = '';
  customerId: string = '';
  passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();
  photoImage: string = '';
  retryCount: number = 0;
  maxRetry: number = 3;

  userVerification: VerificationRequest = {
    computerMotherboardSerialNumber: localStorage.getItem('motherboardSerialNumber') ?? ""
  }

  ngOnInit(): void {
    this.verifyUser(this.userVerification)
  }

  verifyUser(request: VerificationRequest) {
    this.userService.verifyUser(request).subscribe({
      next: (response: VerificationResponse) => {
        if (response.userExist) {
          this.referenceFaceId = response.referenceFaceId;
          this.createCustomer();
        }
        else
          this.showMessage = true;
      }
    })
  }

  // TODO: Remove this code, use handleLiveness class to implement below code
  createCustomer(): void {
    this.innovatricsService.createCustomer().subscribe({
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

  createLiveness(customerId: string): void {
    this.innovatricsService.createLiveness(customerId).subscribe({
      next: (response: CreateCustomerResponse) => {
        this.showCamera = true;
        this.customerId = customerId;
      },
      error: (error) => {
        console.error('Error create liveness:', error);
      }
    })
  }

  generatePassiveLivenessSelfie(image: unknown) {
    this.photoImage = jpegBase64ToStringBase64(image);
    this.passiveLivenessSelfieModel.image.Data = this.photoImage;
    this.innovatricsService.generatePassiveLivenessSelfie(this.customerId, this.passiveLivenessSelfieModel).subscribe({
      next: (_) => {
        this.evaluatePassiveLiveness();
      },
      error: (error) => {
        console.error('Error Generating Passive Liveness Selfie:', error);
      }
    })
  }

  evaluatePassiveLiveness() {
    this.innovatricsService.evaluatePassiveLiveness(this.customerId).subscribe({
      next: (response: ScoreResponse) => {
        const score: number = +response.score;

        if (score < 0.89) {
          this.retryCount++;
          this.evaluateRetries()
          this.alertService.error("Failed Liveness. Please try again.")
          return;
        }
        this.probeFaceVerification(this.photoImage);
      },
      error: (error) => {
        console.error('Error Evaluating Passive Liveness:', error);
      }
    })
  }

  probeFaceVerification(image: unknown) {
    this.probeFaceRequest.Image.Data = image;
    this.probeFaceRequest.Detection.Mode = 'STRICT';
    this.probeFaceRequest.Detection.Facesizeratio.Max = 0.5;
    this.probeFaceRequest.Detection.Facesizeratio.Min = 0.05;
    this.probeFaceRequest.referenceFaceId = this.referenceFaceId;

    this.userService.probeFaceVerification(this.probeFaceRequest).subscribe({
      next: (response: ScoreResponse) => {
        this.authService.login(response)
        console.log(response)
        // if (response.errorMessage) {
        //   this.retryCount++;
        //   this.alertService.error("Authentication failed: Face didn't match");
        //   this.evaluateRetries()
        //   return;
        // }

        this.router.navigate(['/home', { score: response.score }])
      },
      complete: () => {
      },
      error: (error) => {

        console.error('Error registering user:', error);
      }
    })
  }

  evaluateRetries() {
    if (this.retryCount === this.maxRetry)
      this.showCamera = false;
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {
    this.imageUrl = URL.createObjectURL(imageData.image);
    blobToBase64(this.imageUrl)
      .then(base64String => {
        this.generatePassiveLivenessSelfie(base64String);
      });
  }

  handleError(error: Error) {
    this.alertService.error("Face not recognised on this machine");
    this.alertService.error(error.message);
    alert(error);
  }

}
