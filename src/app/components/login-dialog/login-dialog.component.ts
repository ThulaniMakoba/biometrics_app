import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationOptionRequest } from 'src/app/models/authentication-option-request.model';
import { LoginIdDialogRequest } from 'src/app/models/login-id-dialog-request.model';
import { UserModel } from 'src/app/models/user-model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  encapsulation: ViewEncapsulation.None, // Use ViewEncapsulation.None to apply global styles
})
export class LoginDialogComponent {
  selectedOption: string = '';
  saId: string = '';
  ednaId: number | undefined;
  adEmailAddress: string = '';
  emailNotFound: boolean = false;


  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private router: Router,
    public authService: AuthService, private userService: UserService, private alertService: AlertService,) { }

  loginDialogFormControl = new FormControl('', [Validators.required, Validators.email])

  navigateToLogin() {
    const request: AuthenticationOptionRequest = {
      eDNAId: this.ednaId,
      idNumber: this.saId,
      email: this.loginDialogFormControl.value as string
    }

    this.userService.validateAuthOption(request).subscribe({
      next: (response: UserModel) => {
        if (response.isSuccess) {
          this.emailNotFound = false;
          this.authService.passIDtoLogin(response);
          this.dialogRef.close();
        }

        this.emailNotFound = true;
        // this.authService.login(response);
      },
      complete: () => {
      },
      error: (error) => {
        this.alertService.error('Server error on authentication', error);
      }

    })
  }

  onClose(): void {
    this.dialogRef.close();
    this.router.navigate(['home']);
  }
}
