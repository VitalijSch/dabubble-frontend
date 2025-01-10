import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";
import { ProfileService } from '../../services/profile/profile.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('search') searchField!: ElementRef;

  userService: UserService = inject(UserService);
  profileService: ProfileService = inject(ProfileService);

  private accountsService: AccountsService = inject(AccountsService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
    this.accountsService.refreshAccessToken().subscribe({
      next: (response) => this.setUserData(response),
      error: (error) => this.handleCheckLoggedError(error),
    });
  }

  private setUserData(response: any): void {
    this.userService.userData = response.user;
  }

  private handleCheckLoggedError(error: any): void {
    console.error(error);
    this.navigateToLogin();
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  focusInputField(): void {
    this.searchField.nativeElement.focus();
  }

  getAvatar(): string {
    const user = this.userService.userData;
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }
}
