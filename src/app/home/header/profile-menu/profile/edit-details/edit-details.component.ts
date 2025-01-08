import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../interfaces/user';
import { UserService } from '../../../../../services/user/user.service';
import { AccountsService } from '../../../../../services/accounts/accounts.service';

@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-details.component.html',
  styleUrl: './edit-details.component.scss'
})
export class EditDetailsComponent {
  editUserForm!: FormGroup;
  userData!: User;
  isEmailExist: boolean = false;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private accountsService: AccountsService = inject(AccountsService);

  constructor() {
    this.userData = this.userService.userData;
  }

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  private initializeSignInForm(): void {
    this.editUserForm = this.formBuilder.group({
      username: [this.userData.user.username, Validators.required],
      email: [this.userData.user.email, [Validators.required, Validators.email]],
    });
  }

  checkIfEmailExist(): void {
    if (this.isEmailValid()) {
      this.checkEmailExistence();
    }
  }

  private isEmailValid(): boolean {
    return this.editUserForm.get('email')?.valid ?? false;
  }

  private checkEmailExistence(): void {
    const email = this.getEmailFromForm();
    this.accountsService.checkEmailExist(email).subscribe({
      next: (response) => this.handleEmailExistenceResponse(response),
      error: (error) => this.handleEmailExistenceError(error),
    });
  }

  private getEmailFromForm(): string {
    return this.editUserForm.get('email')?.value ?? '';
  }

  private handleEmailExistenceResponse(response: any): void {
    this.isEmailExist = response.isEmailExist;
  }

  private handleEmailExistenceError(error: any): void {
    console.error(error);
  }

  editUser(): void {

  }
}
