import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from "../toast-message/toast-message.component";
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordsMatchValidator } from './validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';

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

  ngOnInit(): void {
    this.initializeResetPasswordForm();
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

  resetPassword(): void {

  }
}
