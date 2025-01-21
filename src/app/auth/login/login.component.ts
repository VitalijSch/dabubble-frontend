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

  get user(): User {
    return this.userService.user;
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

  private setUserData(response: any): void {
    this.userService.user = response.user;
  }

  private navigateToHome(): void {
    this.router.navigate([`home/${this.user.id}/new-message`]);
  }

  private handleLoginError(error: any): void {
    console.error(error);
    this.toggleAuthenticationMessage();
  }

  private toggleAuthenticationMessage(): void {
    this.showAuthenticationMessage();
    setTimeout(() => {
      this.hideAuthenticationMessage();
    }, 4000);
  }

  private showAuthenticationMessage(): void {
    this.isAuthenticated = false;
  }

  private hideAuthenticationMessage(): void {
    this.isAuthenticated = true;
  }

  loginGuest(): void {
    this.accountsService.loginGuest().subscribe({
      error: (error) => console.error(error),
    });
  }
}
