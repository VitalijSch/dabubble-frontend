import { inject, Injectable } from '@angular/core';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  selectedFile: any = './../../../assets/avatars/avatar-0.png';
  uploadedFile!: File;

  private userService: UserService = inject(UserService);

  onUploadButtonClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    this.getSelectedFile(fileInput);
    this.setUploadedAvatarFromSelectedFile();
    this.convertSelectedFileToDataUrl();
    this.resetFileInput(fileInput);
  }

  private getSelectedFile(fileInput: HTMLInputElement): void {
    if (this.hasSelectedFile(fileInput)) {
      this.assignSelectedFile(fileInput);
    }
  }

  private hasSelectedFile(fileInput: HTMLInputElement): boolean {
    return fileInput.files !== null && fileInput.files.length > 0;
  }

  private assignSelectedFile(fileInput: HTMLInputElement): void {
    this.selectedFile = fileInput.files![0];
  }

  private setUploadedAvatarFromSelectedFile(): void {
    this.userService.newUser.uploaded_avatar = this.selectedFile;
  }

  private convertSelectedFileToDataUrl(): void {
    if (this.selectedFile) {
      this.convertFileToDataUrl(this.selectedFile);
    }
  }

  private convertFileToDataUrl(file: File): void {
    this.setUploadedFile(file);
    const reader = this.createFileReader(() => this.handleFileReaderLoad(reader.result));
    reader.readAsDataURL(file);
  }

  private setUploadedFile(file: File): void {
    this.uploadedFile = file;
  }

  private createFileReader(onLoadCallback: () => void): FileReader {
    const reader = new FileReader();
    reader.onload = onLoadCallback;
    return reader;
  }

  private handleFileReaderLoad(result: string | ArrayBuffer | null): void {
    if (result) {
      this.updateUserAvatar(result);
    }
  }

  private updateUserAvatar(dataUrl: string | ArrayBuffer): void {
    this.selectedFile = dataUrl;
  }

  private resetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = '';
  }

  resetSelectedFile(): void {
    this.selectedFile = './../../../assets/avatars/avatar-0.png';
  }
}
