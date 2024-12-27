import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateUserService } from '../../services/create-user/create-user.service';
import { CreateUser } from '../../interfaces/create-user';

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

  private formBuilder: FormBuilder = inject(FormBuilder);
  private createUserService: CreateUserService = inject(CreateUserService);
  private router: Router = inject(Router);

  constructor() {
    this.userData = this.createUserService.userData();
  }

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  private initializeSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      username: [this.userData.username, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email]],
      password: [this.userData.password, [Validators.required, Validators.minLength(8)]],
      isTermsAccepted: [this.userData.isTermsAccepted, Validators.requiredTrue],
    });
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
