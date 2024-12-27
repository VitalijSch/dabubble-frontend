import { Injectable, signal } from '@angular/core';
import { CreateUser } from '../../interfaces/create-user';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  initialUserData: CreateUser = {
    username: '',
    email: '',
    password: '',
    isTermsAccepted: false,
  };

  userData = signal<CreateUser>(this.initialUserData);

  setUserData(userData: CreateUser): void {
    this.userData.set({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      isTermsAccepted: userData.isTermsAccepted,
    });
  }

  getUserData(): CreateUser {
    return this.userData();
  }

  resetUserData(): void {
    this.userData.set(this.initialUserData);
  }

  setSelectedAvatar(avatar: number): void {
    this.userData().selected_avatar = `./../../../assets/avatars/avatar-${avatar}.png`;
  }
}
