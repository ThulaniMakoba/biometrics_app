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
import { Router } from '@angular/router';


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
  cachedUserId:number = 0;
  cachedEdnaNumber:number = 0;
  cachedUserModel : string;
  cachedUserDetailsReq : string;
  

  userModel: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    isSuccess: false,
    userId: 0,
  };


  constructor(private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    public loadingService: LoadingService,
    private innovatricsOperation: InnovatricsOperations,
    private router: Router,
  ) { }

  ngOnInit(): void {

    let cachedCount = localStorage.getItem('loginRetryCount');    
    this.retryCount = cachedCount == null ? 0:+cachedCount;
      this.saveToLocalStorage();
     if (this.cachedUserId !== null) {   
        this.isLogin = true;
        this.showCamera = true; 
      } else
        this.router.navigate(['/home'])
  }

  saveToLocalStorage(): void{

      const cachedUserIdStr = localStorage.getItem('cachedUserIdLogin');      
      this.cachedUserId = cachedUserIdStr ? +cachedUserIdStr : 0;  
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
          localStorage.setItem('loginRetryCount',this.retryCount.toString());
          this.evaluateRetries();
          this.alertService.error(`Failed Liveness. Please try again. Left with ${this.maxRetry - this.retryCount} attempts!`);
          return;
        }

        this.probeFaceVerification(this.photoImage);

      })
  }

  probeFaceVerification(image: unknown) {
    localStorage.removeItem('loginRetryCount');
    this.progressMessage = 'Authenticating Face for login...'
    this.probeFaceRequest.Image.Data = image;
    this.probeFaceRequest.Detection.Mode = 'STRICT';
    this.probeFaceRequest.Detection.Facesizeratio.Max = 0.5;
    this.probeFaceRequest.Detection.Facesizeratio.Min = 0.05;
    this.probeFaceRequest.UserId = this.cachedUserId;
    // this.probeFaceRequest.eDNAId = this.authService.userIdRequest.eDNAId;
    // this.probeFaceRequest.idNumber = this.authService.userIdRequest.idNumber;
    // this.probeFaceRequest.email = this.authService.userIdRequest.email;

    
    this.userService.probeFaceVerification(this.probeFaceRequest).subscribe({
      next: (response: UserModel) => {
        this.isLogin = false;
        this.progressMessage = ' ';        
        this.authService.login(response);
        
           localStorage.removeItem('cachedUserIdLogin');         
           this.cachedUserId = 0;
           //localStorage.removeItem('userDetailsRequest');
           performance.navigation.type === 0
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
        this.isLogin = true;
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
