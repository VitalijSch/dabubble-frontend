import { Component, inject } from '@angular/core';
import { ProfileService } from '../../../../services/profile/profile.service';
// import { DetailsComponent } from "./details/details.component";
import { EditDetailsComponent } from "./edit-details/edit-details.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [EditDetailsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileService: ProfileService = inject(ProfileService);

  toggleProfileViewState(event: Event): void {
    this.handleEvent(event);
    this.profileService.toggleIsCurrentViewProfile()
  }

  private handleEvent(event: Event): void {
    event.stopPropagation();
  }
}
