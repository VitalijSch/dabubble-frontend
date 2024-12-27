import { Component, inject } from '@angular/core';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {
  toastMessageService: ToastMessageService = inject(ToastMessageService);
}
