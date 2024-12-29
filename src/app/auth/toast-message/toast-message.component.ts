import { Component, inject } from '@angular/core';
import { ToastMessageService } from '../../services/toast-message/toast-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {
  routesToMessages = {
    'choose-avatar': 'Konto erfolgreich erstellt!',
    'forgot-password': 'E-Mail gesendet!',
    'reset-password': 'Anmelden',
  }

  toastMessageService: ToastMessageService = inject(ToastMessageService);

  private router: Router = inject(Router);

  getMessageForRoute(): string {
    const currentUrl = this.router.url;
    for (const [route, message] of Object.entries(this.routesToMessages)) {
      if (currentUrl.includes(route)) {
        return message;
      }
    }
    return '';
  }
}
