import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { fullEmailValidator } from './validators/email.validator';
import { UserService } from '../../services/user/user.service';
import { NewUser } from '../../interfaces/new-user';
import { AccountsApiService } from '../../services/accounts-api/accounts-api.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm!: FormGroup;
  isEmailExist: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private accountsApiService: AccountsApiService = inject(AccountsApiService);

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  get newUser(): NewUser {
    return this.userService.newUser;
  }

  private initializeSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      username: [this.newUser.username, Validators.required],
      email: [this.newUser.email, [Validators.required, Validators.email, , fullEmailValidator()]],
      password: [this.newUser.password, [Validators.required, Validators.minLength(8)]],
      isTermsAccepted: [this.newUser.isTermsAccepted, Validators.requiredTrue],
    });
  }

  checkIfEmailExist(): void {
    if (this.isEmailValid()) {
      this.checkEmailExistence();
    }
  }

  private isEmailValid(): boolean {
    return this.signInForm.get('email')?.valid ?? false;
  }

  private checkEmailExistence(): void {
    const email = this.signInForm.get('email')?.value;
    this.accountsApiService.checkEmailExist(email).subscribe({
      next: (response) => this.isEmailExist = response.isEmailExist,
      error: (error) => console.error(error),
    });
  }

  markAndToggleIsTermsAccepted(): void {
    this.markTermsAccepted();
    this.setIsTermsAccepted();
  }

  private markTermsAccepted(): void {
    this.signInForm.get('isTermsAccepted')?.markAsTouched();
  }

  private setIsTermsAccepted(): void {
    const isTermsAccepted = this.signInForm.get('isTermsAccepted')?.value;
    this.signInForm.get('isTermsAccepted')?.setValue(!isTermsAccepted);
  }

  createUserAndNavigateToAvatarSelection(): void {
    this.setUserDataFromForm();
    this.navigateToAvatarSelection();
  }

  private setUserDataFromForm(): void {
    this.userService.newUser = this.signInForm.value;
  }

  private navigateToAvatarSelection(): void {
    this.router.navigate(['auth/choose-avatar']);
  }
}
