import { Component, OnInit } from '@angular/core';
import { PassiveLivenessSelfieRequestModel } from 'src/app/models/passive-liveness-selfie-request.model';
import { ProbeFaceRequest } from 'src/app/models/probe-face-request.model';
import { UserModel } from 'src/app/models/user-model';
import { VerificationRequest } from 'src/app/models/verify-user-request.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { OnPhotoTakenEventValue } from 'src/app/types';
import { blobToBase64 } from 'src/app/utils/helpers';
import { LoginIdDialogRequest } from 'src/app/models/login-id-dialog-request.model';
import { InnovatricsOperations } from 'src/app/shared/innovatrics-operations.class';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showCamera: boolean = false;
  showMessage: boolean = false;
  imageUrl = '';
  probeFaceRequest: ProbeFaceRequest = new ProbeFaceRequest();
  customerId: string = '';
  passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();
  photoImage: string = '';
  retryCount: number = 0;
  maxRetry: number = 3;
  isButtonDisabled = false;
  showSpinner: boolean = false;
  progressMessage: string = '';
  isLogin = false;
  requestLoginHolder: LoginIdDialogRequest;
  unEditedImage: unknown;

  constructor(private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private innovatricsOperation: InnovatricsOperations
  ) { }

  ngOnInit(): void {
    if (this.authService.userIdRequest !== undefined) {
      this.isLogin = true;
      this.showCamera = true;
    }
  }

  createCustomer(): void {
    this.innovatricsOperation.createCustomer()
      .subscribe(res => {
        if (res != undefined) {
          this.customerId = res
          this.createLiveness(this.customerId);
        }
      }
      );
  }

  createLiveness(customerId: string): void {
    this.innovatricsOperation.createLiveness(customerId)
      .subscribe(res => {
        if (res) {
          this.generatePassiveLivenessSelfie()
        }
      })
  }

  generatePassiveLivenessSelfie() {
    this.progressMessage = 'Generate Passive Liveness Selfie...'
    this.innovatricsOperation.generatePassiveLivenessSelfie(this.unEditedImage, this.customerId)
      .subscribe(res => {
        if (res != undefined) {
          this.photoImage = res as string;
          this.evaluatePassiveLiveness();
        }
      })
  }

  evaluatePassiveLiveness() {
    this.progressMessage = 'Evaluate Passive Liveness...'

    this.innovatricsOperation.evaluatePassiveLiveness(this.customerId)
      .subscribe(res => {
        if (!res) {
          this.retryCount++;
          this.evaluateRetries();
          this.alertService.error(`Failed Liveness. Please try again. Left with ${this.maxRetry - this.retryCount} attempts!`);
          return;
        }

        this.probeFaceVerification(this.photoImage);
      })
  }

  probeFaceVerification(image: unknown) {
    this.progressMessage = 'Authenticating Face for login...'
    this.probeFaceRequest.Image.Data = image;
    this.probeFaceRequest.Detection.Mode = 'STRICT';
    this.probeFaceRequest.Detection.Facesizeratio.Max = 0.5;
    this.probeFaceRequest.Detection.Facesizeratio.Min = 0.05;
    this.probeFaceRequest.eDNAId = this.authService.userIdRequest.eDNAId;
    this.probeFaceRequest.idNumber = this.authService.userIdRequest.SAId;
    this.probeFaceRequest.email = this.authService.userIdRequest.ADEmailAddress;

    this.userService.probeFaceVerification(this.probeFaceRequest).subscribe({
      next: (response: UserModel) => {
        this.isLogin = false;
        this.progressMessage = ' ';
        this.authService.login(response);
      },
      complete: () => {
      },
      error: (error) => {
        this.alertService.error('Server error on authentication', error);
      }
    })
  }

  evaluateRetries() {
    if (this.retryCount === this.maxRetry) {
      this.showCamera = false;
    }
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {
    this.imageUrl = URL.createObjectURL(imageData.image);
    blobToBase64(this.imageUrl)
      .then(base64String => {
        this.showSpinner = true;
        this.alertService.clear();
        this.unEditedImage = base64String;
        this.createCustomer();
      });
    this.isButtonDisabled = true;
  }

  handleError(error: Error) {
    this.alertService.error("Face not recognised on this machine");
    this.alertService.error(error.message);
    alert(error);
  }
}
