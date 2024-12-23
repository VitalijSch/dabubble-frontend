import { Component } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [ToastMessageComponent],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

}
