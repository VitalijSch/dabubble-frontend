import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile/profile.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  profileService: ProfileService = inject(ProfileService);
}
