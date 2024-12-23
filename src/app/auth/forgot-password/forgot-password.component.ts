import { Component } from '@angular/core';
import { ToastMessageComponent } from '../toast-message/toast-message.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ToastMessageComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

}
