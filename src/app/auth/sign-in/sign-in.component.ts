import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateUserService } from '../../servies/create-user/create-user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  signInForm!: FormGroup;
  acceptTerms!: boolean;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private createUserService: CreateUserService = inject(CreateUserService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeSignInForm();
    this.checkAndSetAcceptTerms();
  }

  private initializeSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      name: [this.createUserService.userData().name, Validators.required],
      email: [this.createUserService.userData().email, [Validators.required, Validators.email]],
      password: [this.createUserService.userData().password, [Validators.required, Validators.minLength(8)]],
    });
  }

  private checkAndSetAcceptTerms(): void {
    if (this.isUserEmailNotEmpty()) {
      this.setAcceptTerms(true);
    }
  }

  private isUserEmailNotEmpty(): boolean {
    return this.createUserService.userData().email !== '';
  }

  setAcceptTerms(value: boolean): void {
    this.acceptTerms = value;
  }

  createUserAndNavigateToAvatarSelection(): void {
    if (this.acceptTerms){
      this.createUserData();
      this.navigateToAvatarSelection();
    } else {
      this.rejectTerms();
    }
  }

  private createUserData(): void {
    this.createUserService.setUserData(this.signInForm.value);
  }

  private navigateToAvatarSelection(): void {
    this.router.navigate(['auth/choose-avatar']);
  }

  private rejectTerms(): void {
    this.acceptTerms = false;
  }
}
