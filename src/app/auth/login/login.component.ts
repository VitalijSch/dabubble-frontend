import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountsService } from '../../services/accounts/accounts.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../interfaces/user';

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
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);

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
    this.setUserData(response);
    this.navigateToHome();
  }

  private setUserData(response: User): void {
    this.userService.userData = response;
  }

  private navigateToHome(): void {
    this.router.navigate(['home/new-message']);
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

  loginGuest(): void {
    this.accountsService.loginGuest().subscribe({
      next: (response) => this.handleLoginGuestSuccess(response),
      error: (error) => this.handleLoginGuestError(error),
    });
  }

  private handleLoginGuestSuccess(response: any): void {
    console.log(response);
  }

  private handleLoginGuestError(error: any): void {
    console.error(error);
  }
}
