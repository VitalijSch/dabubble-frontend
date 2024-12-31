import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  isToastMessageVisible: boolean = false;

  private router: Router = inject(Router);

  handleToastMessage(): void {
    setTimeout(() => {
      this.setToastMessageVisibility(false);
      this.navigateToLogin();
    }, 2000);
  }

  setToastMessageVisibility(value: boolean): void {
    this.isToastMessageVisible = value;
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }
}
