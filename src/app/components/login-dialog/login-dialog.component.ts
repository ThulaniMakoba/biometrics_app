// login-dialog.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginIdDialogRequest } from 'src/app/models/login-id-dialog-request.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  encapsulation: ViewEncapsulation.None, // Use ViewEncapsulation.None to apply global styles
})
export class LoginDialogComponent implements OnInit {
  selectedOption: string = ''; 
  saId: string = ''; 
  ednaId: number = 0;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,private router: Router,
    public authService:AuthService) { }

  navigateToLogin() {
    // Determine which ID to pass based on the selected option
    const idToPass = this.selectedOption === 'option1' ? this.saId : this.ednaId;    
    const request: LoginIdDialogRequest = {
      eDNAId: this.ednaId,
      SAId: this.saId
    }
    this.authService.passIDtoLogin(request);
    
    this.dialogRef.close();
  }
  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
