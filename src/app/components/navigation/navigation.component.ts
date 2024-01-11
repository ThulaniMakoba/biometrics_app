import { Component, OnInit } from '@angular/core';
import { ComputerConfigResponse } from 'src/app/models/computer-config-response.model';
import { ConfigService } from 'src/app/services/config.service';

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

  constructor(private config: ConfigService) { }

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
