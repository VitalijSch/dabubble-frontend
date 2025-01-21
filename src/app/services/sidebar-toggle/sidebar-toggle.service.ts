import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarToggleService {
  isSidebarHidden: boolean = false;

  toggleIsSidebarHidden(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
