import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { ScoreResponse } from '../models/score-response.model';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { UserModel } from '../models/user-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  session: any = null;
  retryCount: number = 0;
  maxRetry: number = 3;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private messageService: MessageService
  ) { }

  login(userDetails: UserModel) {

    if (userDetails.isSuccess) {
      this.session = { isAuthenticated: true };
      this.alertService.error("Login Successfully");
      this.messageService.sendUserDetails(userDetails);
      this.router.navigate(['/home'])
    }
    else {
      this.retryCount++;
      this.alertService.error("Authentication failed: Face didn't match");
      this.evaluateRetries()
      return;
    }
  }

  logout() {
    this.session = null;
    this.alertService.success("Logout Successful");
    this.messageService.clearUserDetails();
  }

  evaluateRetries() {
    if (this.retryCount === this.maxRetry)
      return;
    // this.showCamera = false;
  }

}
