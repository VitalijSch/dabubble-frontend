import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFileService } from '../upload-file/upload-file.service';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  isToastMessageVisible: boolean = false;

  private router: Router = inject(Router);
  private uploadFileService: UploadFileService = inject(UploadFileService);

  handleToastMessage(): void {
    setTimeout(() => {
      this.setToastMessageVisibility(false);
      this.resetSelectedFile();
      this.navigateToLogin();
    }, 2000);
  }

  setToastMessageVisibility(value: boolean): void {
    this.isToastMessageVisible = value;
  }

  private navigateToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  private resetSelectedFile(): void {
    this.uploadFileService.resetSelectedFile();
  }
}
