import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../interfaces/user';
import { UserService } from '../../../../../services/user/user.service';
import { AccountsService } from '../../../../../services/accounts/accounts.service';
import { ProfileService } from '../../../../../services/profile/profile.service';
import { UploadFileService } from '../../../../../services/upload-file/upload-file.service';
import { fullEmailValidator } from './validators/email.validator';

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
      username: [this.userData.username, Validators.required],
      email: [this.userData.email, [Validators.required, Validators.email, , fullEmailValidator()]],
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
    return email !== this.userData.email;
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
    const user = this.userService.userData;
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  editUser(): void {
    this.accountsService.updateUser(this.createFormData()).subscribe({
      next: (response) => this.handleEditUserSuccess(response),
      error: (error) => this.handleEditUserError(error),
    })
  }

  private createFormData(): FormData {
    const formData = new FormData();
    this.appendUserId(formData);
    this.appendUsername(formData);
    this.appendUserEmail(formData);
    this.appendUserAvatar(formData);
    return formData;
  }

  private appendUserId(formData: FormData): void {
    formData.append('id', this.userService.userData.id.toString());
  }

  private appendUsername(formData: FormData): void {
    const username = this.editUserForm.get('username')?.value;
    if (this.userService.userData.username !== username) {
      formData.append('username', username);
    }
  }

  private appendUserEmail(formData: FormData): void {
    const email = this.editUserForm.get('email')?.value;
    if (this.userService.userData.email !== email) {
      formData.append('email', email);
    }
  }

  private appendUserAvatar(formData: FormData): void {
    if (this.uploadFileService.uploadedFile === undefined) return;
    if (this.isSelectedAvatarFromAssets()) {
      this.appendUserSelected_avatar(formData);
    } else {
      this.appendUserUploaded_avatar(formData);
    }
  }

  private isSelectedAvatarFromAssets(): boolean {
    return this.uploadFileService.selectedFile.includes('assets');
  }

  private appendUserSelected_avatar(formData: FormData): void {
    const selectedFile = this.uploadFileService.selectedFile;
    formData.append('selected_avatar', selectedFile);
  }

  private appendUserUploaded_avatar(formData: FormData): void {
    const uploadedAvatar = this.uploadFileService.uploadedFile;
    formData.append('uploaded_avatar', uploadedAvatar);
  }

  private handleEditUserSuccess(response: any): void {
    this.setUserData(response);
    this.updateEditDetailsState();
  }

  private setUserData(response: any): void {
    this.userService.userData = response;
  }

  private handleEditUserError(error: any): void {
    console.error(error)
  }
}
