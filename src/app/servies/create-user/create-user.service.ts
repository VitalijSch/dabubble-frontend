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
  });

  setUserData(userData: CreateUser): void {
    this.userData.set(userData);
  }

  getUserData(): CreateUser {
    return this.userData();
  }
}
