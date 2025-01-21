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
  token: string = '';

  toastMessageService: ToastMessageService = inject(ToastMessageService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountsService: AccountsService = inject(AccountsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeResetPasswordForm();
    this.getTokenFromRoute();
    this.handlePasswordResetProcess();
  }

  private initializeResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      { validators: passwordsMatchValidator }
    )
  }

  private getTokenFromRoute(): void {
    this.token = this.route.snapshot.paramMap.get('id') ?? '';
  }

  private handlePasswordResetProcess(): void {
    if (this.isTokenInvalid()) {
      this.navigateToLogin();
      return;
    }
    this.processPasswordReset();
  }

  private isTokenInvalid(): boolean {
    return this.token === null;
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  private processPasswordReset(): void {
    this.deletePasswordResetToken();
    this.fetchEmailForPasswordReset();
  }

  private deletePasswordResetToken(): void {
    this.accountsService.deletePasswordResetEmail(this.token).subscribe({
      error: (error) => console.error(error),
    });
  }

  private fetchEmailForPasswordReset(): void {
    this.accountsService.getPasswordResetEmail(this.token).subscribe({
      next: (response) => this.email = response.email,
      error: (error) => console.error(error),
    });
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
      next: () => this.displayToastMessage(),
      error: (error) => console.error(error),
    });
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }
}