import { inject, Injectable } from '@angular/core';
import { CreateUserService } from '../create-user/create-user.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  selectedFile: File | null = null;

  private createUserService: CreateUserService = inject(CreateUserService);

  onUploadButtonClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const selectedFile = this.getSelectedFile(fileInput);
    if (selectedFile) {
      this.convertFileToDataUrl(selectedFile);
    }
    this.resetFileInput(fileInput);
  }

  getSelectedFile(fileInput: HTMLInputElement): File | null {
    if (fileInput.files && fileInput.files.length > 0) {
      return fileInput.files[0];
    }
    return null;
  }

  convertFileToDataUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.updateUserAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  updateUserAvatar(dataUrl: string | ArrayBuffer): void {
    this.createUserService.userData().selectedAvatar = dataUrl;
  }

  resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
  }
}
