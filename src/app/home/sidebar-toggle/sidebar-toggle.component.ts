import { Component, inject } from '@angular/core';
import { SidebarToggleService } from '../../services/sidebar-toggle/sidebar-toggle.service';

@Component({
  selector: 'app-sidebar-toggle',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-toggle.component.html',
  styleUrl: './sidebar-toggle.component.scss',
  host: {
    '(click)': 'sidebarToggleService.toggleIsSidebarHidden()'
  },
})
export class SidebarToggleComponent {
  sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);

  getSidebarStatus(): string {
    return this.sidebarToggleService.isSidebarHidden ? 'öffnen' : 'schließen';
  }
}
