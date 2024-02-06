import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateCustomerResponse } from 'src/app/models/create-customer-response.model';
import { CreateReferenceFaceRequestModel, DetectionModel } from 'src/app/models/create-reference-face-request.model';
import { CreateReferenceFaceResponse } from 'src/app/models/create-reference-face-response.model';
import { CreateReferenceFaceWithoutBackgroundResponse } from 'src/app/models/create-reference-face-without-background-response.model';
import { ImageModel } from 'src/app/models/image.model';
import { PassiveLivenessSelfieRequestModel } from 'src/app/models/passive-liveness-selfie-request.model';
import { RegisterUserResponse } from 'src/app/models/register-user-response.model';
import { UserModel } from 'src/app/models/user-model';
import { VerificationResponse } from 'src/app/models/verification-response.model';
import { VerificationRequest } from 'src/app/models/verify-user-request.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
import { InnovatricsService } from 'src/app/services/innovatrics.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { InnovatricsOperations } from 'src/app/shared/innovatrics-operations.class';
import { OnPhotoTakenEventValue } from 'src/app/types';
import { blobToBase64, jpegBase64ToStringBase64, validateSAIDNumber } from 'src/app/utils/helpers';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {

  loading = false;
  submitted = false;
  showCamera: boolean = false;
  showRegistration: boolean = true;
  userId: number;
  imageUrl = '';
  customerId: string = '';
  photoImage: string = '';
  showSpinner: boolean = false;
  hideActionButtons: boolean = false;
  progressMessage: string = '';
  idNumber: string = '';
  unEditedImage: unknown;
  ednaNumber: number;
  
  motherboardSerialNumber: string | null = localStorage.getItem('motherboardSerialNumber');
  motherboardSerialNumberExist: string | null = localStorage.getItem('motherboardSerialNumberExist');

  userModel: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    isSuccess: false,
    userId: 0,
  };

  userRegistrationForm = new FormGroup({
    idNumber: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  })

  userVerification: VerificationRequest = {
    computerMotherboardSerialNumber: this.motherboardSerialNumber ?? ""
  }

  referenceFaceModel: CreateReferenceFaceRequestModel = {
    Image: new ImageModel(),
    Detection: new DetectionModel(),
    UserId: 0,
    ComputerSerialNumber: ''
  }

  passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();

  constructor(private userService: UserService, private innovatricsOperation: InnovatricsOperations, private formBuilder: FormBuilder,
    private innovatricsService: InnovatricsService, private alertService: AlertService,
    private dialogService: DialogService,private dialog: MatDialog,public authService: AuthService) { }

  ngOnInit() {

    this.userRegistrationForm = this.formBuilder.group({
      idNumber: ['', [Validators.required]],
      //idNumber: new FormControl<string | null>(''), 
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

    });
  }
  protected get f() {
    return this.userRegistrationForm.controls;
  }

  disableFormFields() {
    this.userRegistrationForm.controls['idNumber'].disable();
    this.userRegistrationForm.controls['firstName'].disable();
    this.userRegistrationForm.controls['lastName'].disable();
    this.userRegistrationForm.controls['email'].disable();
  }

  onRecaptureClick() {  
    this.imageUrl = ""; 
    this.alertService.success(`eDNA user Id: ${this.ednaNumber}`)
  }


  openLoginDialog() {
    this.dialogService.openLoginDialog().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }
  validateIDNumber() {
    const idNumberControl = this.userRegistrationForm.get('idNumber');
    if (idNumberControl?.value) {
      const idNumber = idNumberControl.value;
      const isValid = validateSAIDNumber(idNumber);

      if (isValid) {
        idNumberControl.setErrors(null);
      } else {
        idNumberControl.setErrors({ invalidIdNumber: true });
      }
    }
  }

  registerUser(): void {
    if (this.userRegistrationForm.invalid) {
      this.markFormGroupTouched(this.userRegistrationForm);
    }
    if (this.userRegistrationForm.invalid)
      return;
    this.handleUserDetailsFormData();
    this.userService.register(this.userModel).subscribe({
      next: (response: RegisterUserResponse) => {
        if (response.userId > 0) {
          this.alertService.success(`User Details successfully saved. eDNA user Id: ${response.ednaId}`, false);
          this.ednaNumber = response.ednaId
          this.userId = response.userId;
          this.showCamera = true;
          this.showRegistration = false;
          return;
        }
        this.alertService.error(response.message, false)
      },
      error: (error) => {
        this.alertService.error(`Error registering user ${error} `, false)
      }
    })
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
    this.progressMessage = 'Evaluate Passive Liveness...';

    this.innovatricsOperation.evaluatePassiveLiveness(this.customerId)
      .subscribe(res => {
        if (res)
          this.createReferenceFace(this.photoImage);
      })
  }

  createReferenceFace(image: string) {
    this.referenceFaceModel.Image.Data = image;
    this.referenceFaceModel.Detection.Mode = 'STRICT';
    this.referenceFaceModel.Detection.Facesizeratio.Max = 0.5;
    this.referenceFaceModel.Detection.Facesizeratio.Min = 0.05;
    this.referenceFaceModel.UserId = this.userId;
    this.referenceFaceModel.ComputerSerialNumber = this.motherboardSerialNumber ?? "";

    this.progressMessage = 'Preparing Captured Face...'
    this.innovatricsService.createReferenceFaceWithoutBackground(this.referenceFaceModel).subscribe({
      next: (response: CreateReferenceFaceWithoutBackgroundResponse) => {
        if (response.errorMessage !== null || response.errorCode !== null) {
          this.alertService.error(`${response.errorMessage}, Please try again`,);
          this.showSpinner = false;
          return;
        } else {
          this.convertBase64ToImageUrl(response.base64Image);
          this.alertService.success(`Face Registered Successfully! eDNA user Id: ${this.ednaNumber}`)
          this.progressMessage = '';
        }

      },
      complete: () => {
      },
      error: (error: any) => {
        this.alertService.error('Error registering user:', error);
      }
    })
  }

  //Move this code to the utils class
  convertBase64ToImageUrl(base64Image: string) {
    const byteCharacters = atob(base64Image);
    const byteArrays = [];
    const sliceSize = 110517;
    const contentType = 'image/jpeg';

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    this.imageUrl = URL.createObjectURL(blob);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  handleUserDetailsFormData() {
    this.userModel.idNumber = this.userRegistrationForm.get('idNumber')?.value ?? "";
    this.userModel.firstName = this.userRegistrationForm.get('firstName')?.value ?? "";
    this.userModel.lastName = this.userRegistrationForm.get('lastName')?.value ?? "";
    this.userModel.email = this.userRegistrationForm.get('email')?.value ?? "";
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {
    blobToBase64(URL.createObjectURL(imageData.image))
      .then(base64String => {
        this.showSpinner = true;
        this.imageUrl = '';
        this.unEditedImage = base64String;
        this.createCustomer();
        this.alertService.clear();
      });
  }

  handleError(error: Error) {
    alert(error);
  }

  protected resetForm(): void {
    this.userRegistrationForm.reset();
  }
}
