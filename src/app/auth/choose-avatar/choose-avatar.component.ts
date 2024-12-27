import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { RouterModule } from '@angular/router';
import { CreateUserService } from '../../services/create-user/create-user.service';
import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { AccountsService } from '../../services/accounts/accounts.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent, RouterModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  createUserService: CreateUserService = inject(CreateUserService);
  uploadFileService: UploadFileService = inject(UploadFileService);

  private accountsService: AccountsService = inject(AccountsService);

  ngOnInit(): void {
    console.log(this.createUserService.getUserData());
  }

  setAvatarAndUpdateFile(avatar: number): void {
    this.createUserService.setSelectedAvatar(avatar);
    this.updateSelectedFileFromUserData();
  }

  private updateSelectedFileFromUserData(): void {
    this.uploadFileService.selectedFile = this.createUserService.userData().selected_avatar;
  }

  addUser(): void {
    this.accountsService.registerUser(this.createFormData()).subscribe({
      next: () => {
        this.createUserService.resetUserData();
      },
      error: (error) => {
        console.error('Registrierungsfehler:', error);
      }
    });
  }

  private createFormData(): FormData {
    const formData = new FormData();
    this.appendUserData(formData);
    this.appendAvatarData(formData);
    return formData;
  }

  private appendUserData(formData: FormData): void {
    const user = this.createUserService.getUserData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
  }

  private appendAvatarData(formData: FormData): void {
    const user = this.createUserService.getUserData();
    if (this.isAvatarFromAssets() && user.selected_avatar) {
      formData.append('selected_avatar', user.selected_avatar);
    } else if (user.uploaded_avatar) {
      formData.append('uploaded_avatar', user.uploaded_avatar);
    }
  }

  private isAvatarFromAssets(): boolean {
    return this.uploadFileService.selectedFile.includes('assets');
  }
}
