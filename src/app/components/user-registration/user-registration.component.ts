import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCustomerResponse } from 'src/app/models/create-customer-response.model';
import { CreateReferenceFaceRequestModel, DetectionModel } from 'src/app/models/create-reference-face-request.model';
import { CreateReferenceFaceResponse } from 'src/app/models/create-reference-face-response.model';
import { CreateReferenceFaceWithoutBackgroundResponse } from 'src/app/models/create-reference-face-without-background-response.model';
import { ImageModel } from 'src/app/models/image.model';
import { PassiveLivenessSelfieRequestModel } from 'src/app/models/passive-liveness-selfie-request.model';
import { RegisterUserResponse } from 'src/app/models/register-user-response.model';
import { UserModel } from 'src/app/models/user-model';
import { AlertService } from 'src/app/services/alert.service';
import { InnovatricsService } from 'src/app/services/innovatrics.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { OnPhotoTakenEventValue } from 'src/app/types';
import { blobToBase64, jpegBase64ToStringBase64 } from 'src/app/utils/helpers';

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

  computerSid: string | null = localStorage.getItem('computerSid');
  windowsProfileId: string = '6ABF775B-3A03-4608-946F-6127D9A510AB';
  computerSidExist: string | null = localStorage.getItem('computerSidExist');


  userModel: UserModel = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    idNumber: '',
    computerMotherSerialNumber: ''
  };


  userRegistrationForm = new FormGroup({
    idNumber: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    userName: new FormControl(''),
    email: new FormControl(''),
  })
  

  constructor(private userService: UserService, private messageService: MessageService, private formBuilder: FormBuilder,
    private innovatricsService: InnovatricsService, private alertService: AlertService) { }

  ngOnInit() {
    this.userRegistrationForm = this.formBuilder.group({
      idNumber: ['', [Validators.required, this.validateIdNumber]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],

    });
  }
  protected get f() {
    return this.userRegistrationForm.controls;
  }

  referenceFaceModel: CreateReferenceFaceRequestModel = {
    Image: new ImageModel(),
    Detection: new DetectionModel(),
    UserId: 0,
  }

  passiveLivenessSelfieModel: PassiveLivenessSelfieRequestModel = new PassiveLivenessSelfieRequestModel();


  // TODO: Remove this code, use handleLiveness class to implement below code
  createCustomer(): void {
    this.innovatricsService.createCustomer().subscribe({
      next: (response: CreateCustomerResponse) => {
        this.createLiveness(response.id)
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error create customer:', error);
      }
    })
  }

  createLiveness(customerId: string): void {
    this.innovatricsService.createLiveness(customerId).subscribe({
      next: (response: CreateCustomerResponse) => {
        console.log('createLiveness response =>', response)
        this.customerId = customerId;
        this.showCamera = true;
        this.showRegistration = false;
      },
      error: (error: any) => {
        console.error('Error create liveness:', error);
      }
    })
  }

  generatePassiveLivenessSelfie(image: unknown) {
    this.photoImage = jpegBase64ToStringBase64(image);
    this.passiveLivenessSelfieModel.image.Data = this.photoImage;
    this.innovatricsService.generatePassiveLivenessSelfie(this.customerId, this.passiveLivenessSelfieModel).subscribe({
      next: (_: any) => {
        this.evaluatePassiveLiveness();
      },
      error: (error: any) => {
        console.error('Error Generating Passive Liveness Selfie:', error);
      }
    })
  }

  evaluatePassiveLiveness() {
    this.innovatricsService.evaluatePassiveLiveness(this.customerId).subscribe({
      next: (response: { score: string | number; }) => {
        const score: number = +response.score;
        //The code should be move to the back end
        if (score < 0.89) {
          //use the alert service to display the message
          this.messageService.sendMessage("Fail Liveness")
          return;
        }
        this.createReferenceFace(this.photoImage);
      },
      error: (error: any) => {
        console.error('Error Evaluating Passive Liveness:', error);
      }
    })
  }

  createReferenceFace(image: string) {
    this.referenceFaceModel.Image.Data = image;

    this.referenceFaceModel.Detection.Mode = 'STRICT';
    this.referenceFaceModel.Detection.Facesizeratio.Max = 0.5;
    this.referenceFaceModel.Detection.Facesizeratio.Min = 0.05;
    this.referenceFaceModel.UserId = this.userId;

    this.innovatricsService.createReferenceFaceWithoutBackground(this.referenceFaceModel).subscribe({
      next: (response: CreateReferenceFaceWithoutBackgroundResponse) => {        
        console.log('base64Image =>', response.base64Image)
        this.convertBase64ToImageUrl(response.base64Image);       
      },
      complete: () => {
      },
      error: (error: any) => {
        console.error('Error registering user:', error);
      }
    })
  }

  convertBase64ToImageUrl(base64Image: string) {
    const byteCharacters = atob(base64Image);
    const byteArrays = [];
    const sliceSize = 110517;
    const contentType ='image/jpeg'; 
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
      
    const blob = new Blob(byteArrays, {type: contentType});   
    this.imageUrl = URL.createObjectURL(blob);
    console.log('convertBase64ToImageUrl =>',blob)    
  }

  registerUser(): void {
    if (this.userRegistrationForm.invalid) {
      this.markFormGroupTouched(this.userRegistrationForm);
    }
    this.handleUserDetailsFormData();
    this.userService.register(this.userModel).subscribe({
      next: (response: RegisterUserResponse) => {
        if (response.userId) {
          //alert(response.message)
          this.alertService.success('Registration successful', true);
          this.userId = response.userId;
          this.createCustomer();
          return;
        }
      },
      error: (error) => {
        //console.error('Error registering user:', error);
        this.alertService.error('Error registering user', true)
      }
    })
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  //Move this validation to util class, make it a helper
  validateIdNumber(control: { value: any; }) {
    const idNumber = control.value;

    if (idNumber && idNumber.length === 13 && /^\d+$/.test(idNumber)) {
      // Basic format validation, you can add more checks if needed
      return null;
    } else {
      return { invalidIdNumber: true };
    }
  }

  handleUserDetailsFormData() {
    this.userModel.computerMotherSerialNumber = this.computerSid ?? "";
    this.userModel.idNumber = this.userRegistrationForm.get('idNumber')?.value ?? "";
    this.userModel.firstName = this.userRegistrationForm.get('firstName')?.value ?? "";
    this.userModel.lastName = this.userRegistrationForm.get('lastName')?.value ?? "";
    this.userModel.userName = this.userRegistrationForm.get('userName')?.value ?? "";
    this.userModel.email = this.userRegistrationForm.get('email')?.value ?? "";
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {        
    //this.imageUrl = URL.createObjectURL(imageData.image);
    blobToBase64(URL.createObjectURL(imageData.image))
      .then(base64String => {
        this.showSpinner = true
        this.generatePassiveLivenessSelfie(base64String);
        console.log(base64String)
      });
  }

  handleError(error: Error) {
    alert(error);
  }

  protected resetForm(): void {
    this.userRegistrationForm.reset();
  }  
}
