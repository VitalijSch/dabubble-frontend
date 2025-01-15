import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AccountsService } from '../../../services/accounts/accounts.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  users: User[] = [];
  isDirectMessagesHidden: boolean = false;

  userService: UserService = inject(UserService);
  accountsService: AccountsService = inject(AccountsService);

  ngOnInit(): void {
    this.userList();
  }

  private userList(): void {
    this.accountsService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users
      },
      error: (error) => console.error(error)
    })
  }

  getAvatar(user: User): string {
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  toggleIsDirectMessagesHidden(): void {
    this.isDirectMessagesHidden = !this.isDirectMessagesHidden;
  }
}
