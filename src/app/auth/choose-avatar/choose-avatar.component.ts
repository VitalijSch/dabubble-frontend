import { Component, inject } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';
import { RouterModule } from '@angular/router';
import { CreateUserService } from '../../servies/create-user/create-user.service';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent,RouterModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  private createUserService: CreateUserService = inject(CreateUserService);

  ngOnInit(): void {
    console.log(this.createUserService.getUserData());
  }
}
