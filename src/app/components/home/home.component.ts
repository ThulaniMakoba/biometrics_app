import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user-model';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private subscription: Subscription;
  userDetails: UserModel;
  welcomeMessage: string = 'Welcome ';

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.getUserDetails()
      .subscribe(user => {
        if (user?.firstName)
          this.welcomeMessage = `${this.welcomeMessage} ${user?.firstName} ${user?.lastName}`;
        else
          this.welcomeMessage = 'Welcome ';
      });
  }
}
