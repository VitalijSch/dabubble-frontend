import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-new-messages',
  standalone: true,
  imports: [],
  templateUrl: './new-messages.component.html',
  styleUrl: './new-messages.component.scss'
})
export class NewMessagesComponent {
  userService: UserService = inject(UserService);
}
