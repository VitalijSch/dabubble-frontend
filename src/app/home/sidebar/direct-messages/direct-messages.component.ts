import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { AccountsService } from '../../../services/accounts/accounts.service';
import { User } from '../../../interfaces/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss'
})
export class DirectMessagesComponent {
  isDirectMessagesHidden: boolean = false;
  id: number = 0;

  userService: UserService = inject(UserService);
  accountsService: AccountsService = inject(AccountsService);

  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchIdFromRoute();
    this.userList();
  }

  private fetchIdFromRoute(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
    });
  }

  private userList(): void {
    this.accountsService.getUsers().subscribe({
      next: (response) => this.initializeUserList(response),
      error: (error) => console.error(error),
    })
  }

  private initializeUserList(response: any): void {
    const users = response.users;
    this.assignUsersToService(users);
  }
  
  private assignUsersToService(users: User[]): void {
    this.userService.users = this.sortUsersByCurrentUserId(users);
  }
  
  private sortUsersByCurrentUserId(users: User[]): User[] {
    return users.sort((a, b) => {
      if (a.id === this.id) {
        return -1;
      } else if (b.id === this.id) {
        return 1;
      } else {
        return 0;
      }
    });
  }  

  getAvatar(user: User): string {
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  getUsername(user: User): string {
    return user.id === this.id ? `${user.username} (Du)` : user.username;
  }

  toggleIsDirectMessagesHidden(): void {
    this.isDirectMessagesHidden = !this.isDirectMessagesHidden;
  }
}
