import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @ViewChild('search') searchField!: ElementRef;

  userService: UserService = inject(UserService);

  ngOnInit(): void {
    console.log(this.userService.userData)
  }

  focusInputField(): void {
    this.searchField.nativeElement.focus();
  }

  getAvatar(): string {
    const user = this.userService.userData.user;
    if(user.selected_avatar) {
      return user.selected_avatar;
    }
    return `http://localhost:8000${user.uploaded_avatar!}`;
  }
}
