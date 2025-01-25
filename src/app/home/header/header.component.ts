import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ProfileMenuComponent } from "./profile-menu/profile-menu.component";
import { ProfileService } from '../../services/profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsApiService } from '../../services/accounts-api/accounts-api.service';

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
  private accountsApiService: AccountsApiService = inject(AccountsApiService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.checkAuth();
  }

  checkAuth(): void {
      const id = this.route.snapshot.paramMap.get('userId');
      if (id) {
        this.accountsApiService.refreshAccessToken(id).subscribe({
          next: (response) => this.setUserData(response),
          error: (error) => this.handleCheckLoggedError(error),
        });
      }
  }

  private setUserData(response: any): void {
    this.userService.user = response.user;
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
}
