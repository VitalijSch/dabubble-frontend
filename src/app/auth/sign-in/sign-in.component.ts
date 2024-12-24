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
  acceptTerms: boolean | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private createUserService: CreateUserService = inject(CreateUserService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  private initializeSignInForm(): void {
    this.signInForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  toggleAcceptTerms(value: null | boolean): void {
    this.acceptTerms = value;
  }

  async createUser(): Promise<void> {
    this.checkAcceptTerms();
    if (this.acceptTerms) {
      this.createUserService.setUserData(this.signInForm.value);
      await this.router.navigate(['auth/choose-avatar']);
    }
  }

  private checkAcceptTerms(): void {
    if(this.acceptTerms === null) {
      this.acceptTerms = false;
    }
  }
}
