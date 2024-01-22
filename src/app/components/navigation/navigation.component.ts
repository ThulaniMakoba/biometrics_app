import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComputerConfigResponse } from 'src/app/models/computer-config-response.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  motherboardSerialNumber: string | undefined;

  ngOnInit(): void {
    this.fetchComputerSidNumber();
  }

  constructor(private config: ConfigService, public authService: AuthService,private dialogService: DialogService,private dialog: MatDialog) { }

  openLoginDialog() {
    this.dialogService.openLoginDialog().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  
  fetchComputerSidNumber(): void {
    this.config.fetchComputerSidNumber().subscribe({
      next: (response: ComputerConfigResponse) => {
        this.motherboardSerialNumber = response.computerMotherboardSerialNumber;
        if (!response.success)
          console.error('Error fetching motherboard serial number : ', response.errorMessage);

        localStorage.setItem('motherboardSerialNumberExist', JSON.stringify(response.success));
        localStorage.setItem('motherboardSerialNumber', response.computerMotherboardSerialNumber);
      },
      error: (error) => {
        console.error('Error fetching motherboard serial number: ', error);
      }
    })
  }

}
