import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from "../toast-message/toast-message.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatchValidator } from './validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { AccountsService } from '../../services/accounts/accounts.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ToastMessageComponent, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  email: string = '';

  toastMessageService: ToastMessageService = inject(ToastMessageService);

  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountsService: AccountsService = inject(AccountsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeResetPasswordForm();
    this.handlePasswordResetProcess();
  }

  private initializeResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmedPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      { validators: passwordsMatchValidator }
    )
  }

  private handlePasswordResetProcess(): void {
    const token = this.getTokenFromRoute();
    if (!token) {
      this.navigateToLogin();
      return;
    }
    this.deletePasswordResetToken(token);
    this.fetchEmailForPasswordReset(token);
  }

  private getTokenFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  private deletePasswordResetToken(token: string): void {
    this.accountsService.deletePasswordResetEmail(token).subscribe({
      error: (error) => this.handlePasswordResetTokenError(error),
    });
  }

  private handlePasswordResetTokenError(error: any): void {
    console.error(error);
  }

  private fetchEmailForPasswordReset(token: string): void {
    this.accountsService.getPasswordResetEmail(token).subscribe({
      next: (response) => this.handleEmailForPasswordResetSuccess(response),
      error: (error) => this.handleEmailForPasswordResetError(error),
    });
  }

  private handleEmailForPasswordResetSuccess(response: any): void {
    this.setEmail(response.email);
  }

  private setEmail(email: string): void {
    this.email = email;
  }

  private handleEmailForPasswordResetError(error: any): void {
    console.error(error);
  }

  submitPasswordReset(): void {
    this.showToastMessage();
    this.sendPasswordChangeRequest();
  }

  private showToastMessage(): void {
    this.toastMessageService.setToastMessageVisibility(true);
  }

  private sendPasswordChangeRequest(): void {
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    this.accountsService.changePassword(this.email, newPassword).subscribe({
      next: () => this.handlePasswordChangeRequestSuccess(),
      error: (error) => this.handlePasswordChangeRequestError(error),
    });
  }

  private handlePasswordChangeRequestSuccess(): void {
    this.displayToastMessage();
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }

  private handlePasswordChangeRequestError(error: any): void {
    console.error(error);
  }
}