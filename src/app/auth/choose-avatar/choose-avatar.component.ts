import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { Router, RouterModule } from '@angular/router';
import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { NewUser } from '../../interfaces/new-user';
import { AccountsApiService } from '../../services/accounts-api/accounts-api.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent, RouterModule, CommonModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  formData = new FormData();

  uploadFileService: UploadFileService = inject(UploadFileService);
  toastMessageService: ToastMessageService = inject(ToastMessageService);
  private userService: UserService = inject(UserService);
  private accountsApiService: AccountsApiService = inject(AccountsApiService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.setDefaultUserSelectedAvatar();
    this.redirectToLoginIfUserDataEmpty();
  }

  get newUser(): NewUser {
    return this.userService.newUser;
  }

  private setDefaultUserSelectedAvatar(): void {
    this.newUser.selected_avatar = this.uploadFileService.selectedFile;
  }

  private redirectToLoginIfUserDataEmpty(): void {
    if (this.isUserDataMissing()) {
      this.navigateToSignIn();
    }
  }

  private isUserDataMissing(): boolean {
    return this.newUser.email === '';
  }

  private navigateToSignIn(): void {
    this.router.navigate(['auth/sign-in']);
  }

  setAvatarAndUpdateFile(avatar: number): void {
    this.setAvatar(avatar);
    this.updateSelectedFileFromUserData();
  }

  private setAvatar(avatar: number): void {
    this.userService.setSelectedAvatar(avatar);
  }

  private updateSelectedFileFromUserData(): void {
    this.uploadFileService.selectedFile = this.newUser.selected_avatar;
  }

  addUser(): void {
    this.showToastMessage();
    this.createFormData();
    this.registerUser();
  }

  private showToastMessage(): void {
    this.toastMessageService.setToastMessageVisibility(true);
  }

  private createFormData(): void {
    this.appendUserData();
    this.appendSelectedAvatar();
    this.appendUploadedAvatar();
  }

  private appendUserData(): void {
    this.formData.append('username', this.newUser.username);
    this.formData.append('email', this.newUser.email);
    this.formData.append('password', this.newUser.password);
  }

  private appendSelectedAvatar(): void {
    if (!this.isUploadedFileUndefined()) return;
    this.formData.append('selected_avatar', this.newUser.selected_avatar);
  }

  private appendUploadedAvatar(): void {
    if (this.isUploadedFileUndefined()) return;
    this.formData.append('uploaded_avatar', this.newUser.uploaded_avatar);
  }

  private isUploadedFileUndefined(): boolean {
    return this.uploadFileService.uploadedFile === undefined;
  }

  private registerUser(): void {
    this.accountsApiService.registerUser(this.formData).subscribe({
      next: () => this.handleRegisterUserSuccess(),
      error: (error) => console.error(error),
    });
  }

  private handleRegisterUserSuccess(): void {
    this.displayToastMessage();
    this.resetNewUser();
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }

  private resetNewUser(): void {
    this.userService.resetNewUser();
  }
}
