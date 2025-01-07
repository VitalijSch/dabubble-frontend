import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile/profile.service';
import { AccountsService } from '../../../../services/accounts/accounts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private profileService: ProfileService = inject(ProfileService);
  private accountsService: AccountsService = inject(AccountsService);
  private router: Router = inject(Router);

  logoutUser(event: Event): void {
    this.accountsService.logoutUser().subscribe({
      next: () => this.handleLogoutSuccess(event),
    })
  }

  private handleLogoutSuccess(event: Event): void {
    this.handleEvent(event);
    this.handleViewSwtich();
    this.navigateToLogin()
  }

  private handleEvent(event: Event): void {
    event.stopPropagation();
  }

  private handleViewSwtich(): void {
    this.profileService.handleViewSwitch()
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  toggleProfileViewState(event: Event): void {
    this.handleEvent(event);
    this.profileService.toggleIsCurrentViewProfile()
  }
}
