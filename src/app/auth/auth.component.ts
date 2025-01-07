import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { IntroComponent } from "./intro/intro.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, IntroComponent, RouterModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isIntroPlayed: boolean = false;

  router: Router = inject(Router);

  ngOnInit(): void {
    this.handleIntroForLoginPage();
  }

  handleIntroForLoginPage(): void {
    if (this.isLoginPage()) {
      this.startIntro();
      this.resetIntroAfterDelay(4500);
    }
  }

  private isLoginPage(): boolean {
    return this.router.url.includes('login');
  }

  private startIntro(): void {
    this.isIntroPlayed = true;
  }

  private resetIntroAfterDelay(delay: number): void {
    setTimeout(() => {
      this.isIntroPlayed = false;
    }, delay);
  }
}
