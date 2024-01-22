import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openLoginDialog(): Observable<any> {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px', // Adjust the width as needed
      disableClose: false,
    });

    return dialogRef.afterClosed();
  }
}
