import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateUserService } from '../../services/create-user/create-user.service';
import { CreateUser } from '../../interfaces/create-user';
import { AccountsService } from '../../services/accounts/accounts.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm!: FormGroup;
  userData!: CreateUser;
  isEmailExist: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private createUserService: CreateUserService = inject(CreateUserService);
  private router: Router = inject(Router);
  private accountsService: AccountsService = inject(AccountsService);

  constructor() {
    this.userData = this.fetchUserData();
  }

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  private fetchUserData(): any {
    return this.createUserService.userData();
  }

  private initializeSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      username: [this.userData.username, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      password: [this.userData.password, [Validators.required, Validators.minLength(8)]],
      isTermsAccepted: [this.userData.isTermsAccepted, Validators.requiredTrue],
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
    const email = this.getEmailFromForm();
    this.accountsService.checkEmailExist(email).subscribe({
      next: (response) => this.handleEmailExistenceResponse(response),
      error: (error) => this.handleEmailExistenceError(error),
    });
  }

  private getEmailFromForm(): string {
    return this.signInForm.get('email')?.value ?? '';
  }

  private handleEmailExistenceResponse(response: any): void {
    this.isEmailExist = response.isEmailExist;
  }

  private handleEmailExistenceError(error: any): void {
    console.error(error);
  }

  markAndToggleIsTermsAccepted(): void {
    this.markTermsAccepted();
    this.setIsTermsAccepted();
  }

  private markTermsAccepted(): void {
    const isTermsAcceptedControl = this.signInForm.get('isTermsAccepted');
    isTermsAcceptedControl?.markAsTouched();
  }

  private setIsTermsAccepted(): void {
    const currentValue = this.signInForm.get('isTermsAccepted')?.value;
    this.signInForm.get('isTermsAccepted')?.setValue(!currentValue);
  }

  createUserAndNavigateToAvatarSelection(): void {
    this.createUserData();
    this.navigateToAvatarSelection();
  }

  private createUserData(): void {
    this.createUserService.setUserData(this.signInForm.value);
  }

  private navigateToAvatarSelection(): void {
    this.router.navigate(['auth/choose-avatar']);
  }
}
