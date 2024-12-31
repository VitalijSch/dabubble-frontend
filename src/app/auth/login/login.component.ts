import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsService } from '../../services/accounts/accounts.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isAuthenticated!: boolean;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private accountsService: AccountsService = inject(AccountsService);

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  loginUser(): void {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.accountsService.loginUser(email, password).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (error) => this.handleLoginError(error),
    });
  }

  private handleLoginSuccess(response: any): void {
    console.log(response);
  }

  private handleLoginError(error: any): void {
    console.error(error);
    this.authenticateWithDelay();
  }

  private authenticateWithDelay(): void {
    this.setIsAuthenticatedFalse();
    this.startAuthenticationTimer();
  }

  private setIsAuthenticatedFalse(): void {
    this.isAuthenticated = false;
  }

  private startAuthenticationTimer(): void {
    setTimeout(() => {
      this.isAuthenticated = true;
    }, 4000);
  }
}
