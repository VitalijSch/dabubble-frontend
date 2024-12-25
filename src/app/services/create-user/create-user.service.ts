import { Injectable, signal } from '@angular/core';
import { CreateUser } from '../../interfaces/create-user';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  userData = signal<CreateUser>({
    name: '',
    email: '',
    password: '',
    isTermsAccepted: false,
    selectedAvatar: './../../../assets/avatars/avatar-0.png',
  });

  setUserData(userData: CreateUser): void {
    this.userData.set({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      isTermsAccepted: userData.isTermsAccepted,
      selectedAvatar: './../../../assets/avatars/avatar-0.png',
    });
  }

  getUserData(): CreateUser {
    return this.userData();
  }

  setSelectedAvatar(avatar: number): void {
    this.userData().selectedAvatar = `./../../../assets/avatars/avatar-${avatar}.png`;
  }
}
