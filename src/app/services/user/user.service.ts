import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { NewUser } from '../../interfaces/new-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = [];

  newUser: NewUser = {
    username: '',
    email: '',
    password: '',
    isTermsAccepted: false,
    uploaded_avatar: '',
    selected_avatar: ''
  };

  user: User = {
    id: 0,
    username: '',
    email: '',
    selected_avatar: null,
    uploaded_avatar: null,
    is_online: false
  };

  resetNewUser(): void {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      isTermsAccepted: false,
      uploaded_avatar: '',
      selected_avatar: ''
    }
  }

  setSelectedAvatar(avatar: number): void {
    this.newUser.selected_avatar = `./../../../assets/avatars/avatar-${avatar}.png`;
  }

  getAvatar(user: User): string {
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }
}
