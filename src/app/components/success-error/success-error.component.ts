import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent implements OnInit {
  message: string | null = null;
  isSuccess: boolean = false;

  constructor(private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {
    this.messageService.message$.subscribe((message) => {
      if (message) {
        this.message = message;
        this.isSuccess = message.toLowerCase().includes('success');
        this.router.navigate(['/success-error-page'], {
          queryParams: { message, success: this.isSuccess.toString() },
        })
      }
      else {
        this.message = null;
        this.isSuccess = false;
      }
    })
    // this.messageService.getMessage().subscribe((message) => {
    //   this.message = message;
    // });
  }

  closeMessage() {
    this.message = null;
    this.messageService.clearMessage();
  }
}
