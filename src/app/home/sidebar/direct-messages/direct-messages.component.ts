import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { AccountsApiService } from '../../../services/accounts-api/accounts-api.service';

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
  accountsApiService: AccountsApiService = inject(AccountsApiService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchIdFromRoute();
    this.userList();
  }

  private fetchIdFromRoute(): void {
    this.id = Number(this.route.snapshot.paramMap.get('userId'));
  }

  private userList(): void {
    this.accountsApiService.getUsers().subscribe({
      next: (response) => this.assignUsersToService(response.users),
      error: (error) => console.error(error),
    })
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

  getUsername(user: User): string {
    return user.id === this.id ? `${user.username} (Du)` : user.username;
  }

  toggleIsDirectMessagesHidden(): void {
    this.isDirectMessagesHidden = !this.isDirectMessagesHidden;
  }
}
