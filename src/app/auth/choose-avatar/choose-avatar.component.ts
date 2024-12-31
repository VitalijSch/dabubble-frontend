import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { Router, RouterModule } from '@angular/router';
import { CreateUserService } from '../../services/create-user/create-user.service';
import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent, RouterModule, CommonModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  createUserService: CreateUserService = inject(CreateUserService);
  uploadFileService: UploadFileService = inject(UploadFileService);
  toastMessageService: ToastMessageService = inject(ToastMessageService);

  private accountsService: AccountsService = inject(AccountsService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.redirectToLoginIfUserDataEmpty();
  }

  private redirectToLoginIfUserDataEmpty(): void {
    if (this.isUserDataMissing()) {
      this.navigateToSignIn();
    }
  }

  private isUserDataMissing(): boolean {
    const user = this.createUserService.getUserData();
    return user.email === '';
  }

  private navigateToSignIn(): void {
    this.router.navigate(['auth/sign-in']);
  }

  setAvatarAndUpdateFile(avatar: number): void {
    this.setAvatar(avatar);
    this.updateSelectedFileFromUserData();
  }

  private setAvatar(avatar: number): void {
    this.createUserService.setSelectedAvatar(avatar);
  }

  private updateSelectedFileFromUserData(): void {
    this.uploadFileService.selectedFile = this.createUserService.userData().selected_avatar;
  }

  addUser(): void {
    this.showToastMessage();
    this.registerUser();
  }

  private showToastMessage(): void {
    this.toastMessageService.setToastMessageVisibility(true);
  }

  private registerUser(): void {
    this.accountsService.registerUser(this.createFormData()).subscribe({
      next: () => this.handleRegisterSuccess(),
      error: (error) => this.handleRegisterError(error),
    });
  }

  private handleRegisterSuccess(): void {
    this.resetUserData();
    this.displayToastMessage();
  }

  private createFormData(): FormData {
    const formData = new FormData();
    this.appendUserData(formData);
    this.appendAvatarToFormDataIfPresent(formData);
    return formData;
  }

  private appendUserData(formData: FormData): void {
    const user = this.createUserService.getUserData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
  }

  private appendAvatarToFormDataIfPresent(formData: FormData): void {
    const user = this.createUserService.getUserData();
    if (this.isSelectedAvatarFromAssets() && user.selected_avatar) {
      formData.append('selected_avatar', user.selected_avatar);
    } else if (user.uploaded_avatar) {
      formData.append('uploaded_avatar', user.uploaded_avatar);
    }
  }

  private isSelectedAvatarFromAssets(): boolean {
    return this.uploadFileService.selectedFile.includes('assets');
  }

  private resetUserData(): void {
    this.createUserService.resetUserData();
  }

  private displayToastMessage(): void {
    this.toastMessageService.handleToastMessage();
  }

  private handleRegisterError(error: any): void {
    console.error(error);
  }
}
