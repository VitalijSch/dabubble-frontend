import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile/profile.service';
import { DetailsComponent } from "./details/details.component";
import { EditDetailsComponent } from "./edit-details/edit-details.component";
import { UserService } from '../../../../services/user/user.service';
import { UploadFileService } from '../../../../services/upload-file/upload-file.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DetailsComponent, EditDetailsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileService: ProfileService = inject(ProfileService);
  uploadFileService: UploadFileService = inject(UploadFileService);

  private userService: UserService = inject(UserService);

  constructor() {
    this.getAvatarFile();
  }

  getAvatarFile(): void {
    this.uploadFileService.selectedFile = this.getAvatar();
  }

  private getAvatar(): string {
    const user = this.userService.userData.user;
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  getNameOfProfileHeader(): string {
    return this.profileService.showEditDetails ? 'Dein Profil bearbeiten' : 'Profil';
  }

  toggleProfileViewState(event: Event): void {
    this.handleEvent(event);
    this.profileService.toggleIsCurrentViewProfile()
  }

  private handleEvent(event: Event): void {
    event.stopPropagation();
  }

  onUploadButtonClick(fileInput: HTMLInputElement): void {
    if (this.canUploadFile()) {
      this.uploadFileService.onUploadButtonClick(fileInput);
    }
  }

  private canUploadFile(): boolean {
    return this.profileService.showEditDetails;
  }
}
