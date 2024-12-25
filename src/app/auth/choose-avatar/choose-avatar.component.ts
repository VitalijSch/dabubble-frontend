import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { RouterModule } from '@angular/router';
import { CreateUserService } from '../../services/create-user/create-user.service';
import { UploadFileService } from '../../services/upload-file/upload-file.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent,RouterModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  createUserService: CreateUserService = inject(CreateUserService);
  uploadFileService: UploadFileService = inject(UploadFileService);

  ngOnInit(): void {
    console.log(this.createUserService.getUserData());
  }

  addUser(): void {
    console.log(this.createUserService.getUserData())
  }
}
