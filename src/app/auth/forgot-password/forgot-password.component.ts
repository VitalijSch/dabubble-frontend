import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  private accountsService: AccountsService = inject(AccountsService);

  ngOnInit(): void {
    this.initializeResetPasswordEmailForm();
  }

  private initializeResetPasswordEmailForm(): void {
    this.resetPasswordEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendPasswordResetEmail(): void {
    this.showToastMessage();
    this.accountsService.sendPasswordResetEmail(this.resetPasswordEmailForm.value).subscribe({
      next: () => {
        this.displayToastMessage();
      },
      error: (error) => {
        console.error('Registrierungsfehler:', error);
      }
    });
  }

  private showToastMessage(): void {
    this.toastMessageService.setToastMessageVisibility(true);
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }

  checkIfEmailExist(): void {
    if (this.isEmailValid()) {
      this.checkEmailExistence();
    }
  }

  private isEmailValid(): boolean {
    return this.resetPasswordEmailForm.get('email')?.valid ?? false;
  }

  private checkEmailExistence(): void {
    const email = this.getEmailFromForm();
    this.accountsService.checkEmailExist(email).subscribe({
      next: (response) => {
        this.handleEmailExistenceResponse(response.exists);
      },
      error: (error) => {
        console.error('Registrierungsfehler:', error);
      },
    });
  }

  private getEmailFromForm(): string {
    return this.resetPasswordEmailForm.get('email')?.value ?? '';
  }

  private handleEmailExistenceResponse(exists: boolean): void {
    this.isEmailExist = exists;
  }
}
