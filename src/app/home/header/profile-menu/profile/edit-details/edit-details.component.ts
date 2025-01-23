import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../../interfaces/user';
import { UserService } from '../../../../../services/user/user.service';
import { ProfileService } from '../../../../../services/profile/profile.service';
import { UploadFileService } from '../../../../../services/upload-file/upload-file.service';
import { fullEmailValidator } from './validators/email.validator';
import { AccountsApiService } from '../../../../../services/accounts-api/accounts-api.service';

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
  private accountsApiService: AccountsApiService = inject(AccountsApiService);
  private uploadFileService: UploadFileService = inject(UploadFileService);

  ngOnInit(): void {
    this.initializeSignInForm();
  }

  get user(): User {
    return this.userService.user;
  }

  private initializeSignInForm(): void {
    this.editUserForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email, , fullEmailValidator()]],
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
    const email = this.editUserForm.get('email')?.value;
    if (!this.isEmailChanged(email)) return;
    this.validateEmailExistence(email);
  }

  private isEmailChanged(email: string): boolean {
    return email !== this.user.email;
  }

  private validateEmailExistence(email: string): void {
    this.accountsApiService.checkEmailExist(email).subscribe({
      next: (response) => this.isEmailExist = response.isEmailExist,
      error: (error) => console.error(error),
    });
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
    this.uploadFileService.selectedFile = this.userService.getAvatar(this.user);
  }

  editUser(): void {
    const userData = this.createFormData();
    this.accountsApiService.updateUser(userData).subscribe({
      next: (response) => this.handleEditUserSuccess(response),
      error: (error) => console.error(error),
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
    formData.append('id', this.userService.user.id.toString());
  }

  private appendUsername(formData: FormData): void {
    const username = this.editUserForm.get('username')?.value;
    if (this.userService.user.username === username) return;
    formData.append('username', username);
  }

  private appendUserEmail(formData: FormData): void {
    const email = this.editUserForm.get('email')?.value;
    if (this.userService.user.email === email) return;
    formData.append('email', email);
  }

  private appendUserAvatar(formData: FormData): void {
    if (this.isUploadedFileUndefined()) return;
    this.appendUserSelected_avatar(formData);
    this.appendUserUploaded_avatar(formData);
  }

  private isUploadedFileUndefined(): boolean {
    return this.uploadFileService.uploadedFile === undefined;
  }

  private appendUserSelected_avatar(formData: FormData): void {
    if (!this.isSelectedAvatarFromAssets()) return;
    const selectedFile = this.uploadFileService.selectedFile;
    formData.append('selected_avatar', selectedFile);
  }

  private isSelectedAvatarFromAssets(): boolean {
    return this.uploadFileService.selectedFile.includes('assets');
  }

  private appendUserUploaded_avatar(formData: FormData): void {
    if (this.isSelectedAvatarFromAssets()) return;
    const uploadedAvatar = this.uploadFileService.uploadedFile;
    formData.append('uploaded_avatar', uploadedAvatar);
  }

  private handleEditUserSuccess(response: any): void {
    this.setUserData(response);
    this.updateEditDetailsState();
  }

  private setUserData(response: any): void {
    this.userService.user = response;
  }

}
