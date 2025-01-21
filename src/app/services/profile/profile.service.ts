import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  showProfileMenu: boolean = false;
  showCurrentViewProfile: boolean = false;
  showEditDetails: boolean = false;

  handleViewSwitch(): void {
    if (this.isCurrentViewProfileHide()) {
      this.toggleShowProfileMenu();
    } else {
      this.toggleShowCurrentViewProfile();
    }
  }

  private isCurrentViewProfileHide(): boolean {
    return !this.showCurrentViewProfile;
  }

  toggleShowProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleShowCurrentViewProfile(): void {
    this.showCurrentViewProfile = !this.showCurrentViewProfile;
  }

  toggleShowEditDetails(): void {
    this.showEditDetails = !this.showEditDetails;
  }
}
