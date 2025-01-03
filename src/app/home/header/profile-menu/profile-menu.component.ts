import { Component, inject } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from '../../../services/profile/profile.service';


@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [MenuComponent, ProfileComponent],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss'
})
export class ProfileMenuComponent {
  profileService: ProfileService = inject(ProfileService);
}
