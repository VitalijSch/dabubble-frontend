import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  showProfileMenu: boolean = false;
  isCurrentViewProfile: boolean = false;

  handleViewSwitch(): void {
    if (!this.isCurrentViewProfile) {
      this.toggleShowProfileMenu();
    } else {
      this.toggleIsCurrentViewProfile();
    }
  }

  toggleShowProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  toggleIsCurrentViewProfile(): void {
    this.isCurrentViewProfile = !this.isCurrentViewProfile;
  }
}
