import { inject, Injectable } from '@angular/core';
import { CreateUserService } from '../create-user/create-user.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  selectedFile: any = './../../../assets/avatars/avatar-0.png';

  private createUserService: CreateUserService = inject(CreateUserService);

  onUploadButtonClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.getSelectedFile(fileInput);
    this.setUploadedAvatarFromSelectedFile();
    if (this.selectedFile) {
      this.convertFileToDataUrl(this.selectedFile);
    }
    this.resetFileInput(fileInput);
  }

  private getSelectedFile(fileInput: HTMLInputElement): void {
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  private setUploadedAvatarFromSelectedFile(): void {
    this.createUserService.userData().uploaded_avatar = this.selectedFile;
  }

  private convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.updateUserAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  private updateUserAvatar(dataUrl: string | ArrayBuffer): void {
    this.selectedFile = dataUrl;
  }

  private resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
  }
}
