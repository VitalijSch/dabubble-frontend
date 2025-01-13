import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SidebarToggleComponent } from "./sidebar-toggle/sidebar-toggle.component";
import { SidebarToggleService } from '../services/sidebar-toggle/sidebar-toggle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, SidebarToggleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);
}
