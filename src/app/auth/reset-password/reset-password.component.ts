import { Component } from '@angular/core';
import { ToastMessageComponent } from "../toast-message/toast-message.component";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ToastMessageComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

}
