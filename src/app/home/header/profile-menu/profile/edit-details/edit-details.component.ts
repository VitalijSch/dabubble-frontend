import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../interfaces/user';
import { UserService } from '../../../../../services/user/user.service';
import { AccountsService } from '../../../../../services/accounts/accounts.service';
import { ProfileService } from '../../../../../services/profile/profile.service';
import { UploadFileService } from '../../../../../services/upload-file/upload-file.service';

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

  profileService: ProfileService = inject(ProfileService);

  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);
  private accountsService: AccountsService = inject(AccountsService);
  private uploadFileService: UploadFileService = inject(UploadFileService);

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
    if (!this.isEmailChanged(email)) return;
    this.validateEmailExistence(email);
  }

  private getEmailFromForm(): string {
    return this.editUserForm.get('email')?.value ?? '';
  }

  private isEmailChanged(email: string): boolean {
    return email !== this.userData.user.email;
  }

  private validateEmailExistence(email: string): void {
    this.accountsService.checkEmailExist(email).subscribe({
      next: (response) => this.handleEmailExistenceResponse(response),
      error: (error) => this.handleEmailExistenceError(error),
    });
  }

  private handleEmailExistenceResponse(response: any): void {
    this.isEmailExist = response.isEmailExist;
  }

  private handleEmailExistenceError(error: any): void {
    console.error(error);
  }

  toggleShowEditDetails(event: Event): void {
    this.stopEventPropagation(event);
    this.updateEditDetailsState();
    this.updateAvatarFile();
  }
  
  private stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }
  
  private updateEditDetailsState(): void {
    this.profileService.toggleShowEditDetails();
  }
  
  private updateAvatarFile(): void {
    this.uploadFileService.selectedFile = this.resolveAvatar();
  }
  
  private resolveAvatar(): string {
    const user = this.userService.userData.user;
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  editUser(): void {
    console.log('drinnen')
  }
}
