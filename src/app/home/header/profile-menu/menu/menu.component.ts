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
  profileService: ProfileService = inject(ProfileService);

  private accountsService: AccountsService = inject(AccountsService);
  private router: Router = inject(Router);

  logoutUser(): void {
    this.accountsService.logoutUser().subscribe({
      next: (response) => this.navigateToLogin(),
    })
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }
}
