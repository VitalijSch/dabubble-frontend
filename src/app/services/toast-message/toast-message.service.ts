import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  isToastMessageVisible: boolean = false;

  private router: Router = inject(Router);

  setToastMessageVisibility(value: boolean): void {
    this.isToastMessageVisible = value;
  }

  handleToastMessage(): void {
    setTimeout(() => {
      this.setToastMessageVisibility(false);
      this.router.navigate(['auth/login']);
    }, 2000);
  }
}
