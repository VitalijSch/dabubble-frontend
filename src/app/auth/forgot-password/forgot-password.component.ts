import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountsApiService } from '../../services/accounts-api/accounts-api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ToastMessageComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  resetPasswordEmailForm!: FormGroup;
  isEmailExist: boolean = false;

  toastMessageService: ToastMessageService = inject(ToastMessageService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountsApiService: AccountsApiService = inject(AccountsApiService);

  ngOnInit(): void {
    this.initializeResetPasswordEmailForm();
  }

  private initializeResetPasswordEmailForm(): void {
    this.resetPasswordEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendResetEmailWithNotification(): void {
    this.showToastMessage();
    this.sendPasswordResetEmail();
  }

  private showToastMessage(): void {
    this.toastMessageService.setToastMessageVisibility(true);
  }

  private sendPasswordResetEmail(): void {
    const email = this.resetPasswordEmailForm.value;
    this.accountsApiService.sendPasswordResetEmail(email).subscribe({
      next: () => this.displayToastMessage(),
      error: (error) => console.error(error),
    });
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }

  checkEmailExistence(): void {
    const email = this.resetPasswordEmailForm.get('email')?.value;
    this.accountsApiService.checkEmailExist(email).subscribe({
      next: (response) => this.isEmailExist = response.isEmailExist,
      error: (error) => console.error(error),
    });
  }
}
