import { Component } from '@angular/core';
import { CreateCustomerResponse } from 'src/app/models/create-customer-response.model';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { OnPhotoTakenEventValue } from 'src/app/types';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  userModel: UserModel = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    innovatricsId: '',
  };

  imageUrl = '';
  canDisplayCamera: boolean = false;

  constructor(private userService: UserService) { }

  createCustomer(): void {
    this.userService.createCustomer().subscribe({
      next: (response: CreateCustomerResponse) => {
        this.registerUser(response.id);
      },
      complete: () => {
      },
      error: (error) => {
        console.error('Error create customer:', error);
      }
    })
  }

  registerUser(innovatricsId: string): void {
    this.userModel.innovatricsId = innovatricsId;
    this.userService.register(this.userModel).subscribe({
      complete: () => {
        this.canDisplayCamera = true;
      },
      error: (error) => {
        console.error('Error registering user:', error);
      }
    })
  }

  handlePhotoTaken<T>({ imageData, content }: OnPhotoTakenEventValue<T>) {
    this.imageUrl = URL.createObjectURL(imageData.image);
  }

  handleError(error: Error) {
    alert(error);
  }

}
