import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { ScoreResponse } from '../models/score-response.model';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { UserModel } from '../models/user-model';
import { LoginIdDialogRequest } from '../models/login-id-dialog-request.model';
import { AuthenticationOptionRequest } from '../models/authentication-option-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  session: any = null;
  retryCount: number = 0;
  maxRetry: number = 3;
  isAccountLocked: boolean = false;
  userDetailRequest: UserModel;
  
  constructor(
    private alertService: AlertService,
    private router: Router,
    private messageService: MessageService
  ) { }

  passIDtoLogin(userDetailRequest: UserModel) {
    this.userDetailRequest = userDetailRequest;
   
    localStorage.setItem('cachedUserIdLogin',userDetailRequest.userId.toString());
    this.router.navigate(['login']);
  }

  
  login(userDetails: UserModel) {
    let cachedCount = localStorage.getItem('authRetryCount');   
    this.retryCount = cachedCount == null ? 0:+cachedCount;
    if (userDetails.isSuccess) {
      this.session = { isAuthenticated: true };
      this.alertService.error("Login Successfully");
      userDetails.firstName = 'Login';
      this.messageService.sendUserDetails(userDetails);
      this.retryCount = 0;
      localStorage.removeItem('authRetryCount')
      this.clearMessage(10000);
      this.router.navigate(['/home'])
    }
    else {
      this.retryCount++;
      localStorage.setItem('authRetryCount',this.retryCount.toString());
      this.alertService.error(`Authentication failed: Face didn't match. Left with ${this.maxRetry - this.retryCount} attempts!`);
      this.evaluateRetries()
      return;
    }
  }

  logout() {
    this.session = null;
    this.retryCount = 0;
    this.alertService.success("Logout Successful");
    this.messageService.clearUserDetails();
    this.clearMessage(5000);
  }

  clearMessage(time: number) {
    setTimeout(() => {
      this.alertService.clear();
    }, time);
  }


  evaluateRetries() {

   
    if (this.retryCount === this.maxRetry) {
      this.isAccountLocked = true;
      this.router.navigate(['/locked-out'])
    }
  }

}
