import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

  constructor(public authService: AuthService, private dialogService: DialogService) { }

  openLoginDialog() {
    this.dialogService.openLoginDialog().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }
}
