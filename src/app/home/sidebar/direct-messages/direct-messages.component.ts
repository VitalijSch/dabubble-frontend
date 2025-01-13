import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  closeDirectMessages: boolean = false;

  userService: UserService = inject(UserService);

  toggleCloseDirectMessages(): void {
    this.closeDirectMessages = !this.closeDirectMessages;
  }
}
