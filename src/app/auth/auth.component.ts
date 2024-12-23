import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { IntroComponent } from "./intro/intro.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, IntroComponent, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  router: Router = inject(Router);
}
