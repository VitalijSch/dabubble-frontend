import { Component, inject } from '@angular/core';
import { UserService } from '../../../../../services/user/user.service';
import { ProfileService } from '../../../../../services/profile/profile.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  userService: UserService = inject(UserService);
  profileService: ProfileService = inject(ProfileService);

  getUserOnlineStatus(): string {
    return this.userService.user.is_online ? 'Online' : 'Offline';
  }
}
