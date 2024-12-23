import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IntroComponent } from "./intro/intro.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, IntroComponent, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
