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
  //cachedUserId:number = 0;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private messageService: MessageService
  ) { }

  passIDtoLogin(userDetailRequest: UserModel) {
    this.userDetailRequest = userDetailRequest;
    // const cachedUserIdStr = localStorage.getItem('cachedUserId');
    // this.cachedUserId = cachedUserIdStr ? +cachedUserIdStr : 0;

    // this.cachedUserId = userDetailRequest.userId;  
    // localStorage.setItem('cachedUserId',this.cachedUserId.toString());
    
    this.router.navigate(['login']);
  }

  
  login(userDetails: UserModel) {
    
    if (userDetails.isSuccess) {
      this.session = { isAuthenticated: true };
      this.alertService.error("Login Successfully");
      this.messageService.sendUserDetails(this.userDetailRequest);
      this.retryCount = 0;
      this.clearMessage(10000);
      this.router.navigate(['/home'])
    }
    else {
      this.retryCount++;
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
