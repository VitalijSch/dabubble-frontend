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

  toastMessageService: ToastMessageService = inject(ToastMessageService);

  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountsService: AccountsService = inject(AccountsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeResetPasswordForm();
    this.deletePasswordResetEmail();
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

  private deletePasswordResetEmail(): void {
    const token = this.getTokenFromRoute();
    if (token) {
      this.deleteToken(token);
    }
  }

  private getTokenFromRoute(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  private deleteToken(token: string): void {
    this.accountsService.deletePasswordResetEmail(token).subscribe({
      error: (error) => this.navigateToLogin(),
    });
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  resetPassword(): void {

  }
}
