import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/accounts';

  private http: HttpClient = inject(HttpClient);

  checkEmailExist(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-email/`, {email});
  }

  registerUser(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-user/`, data);
  }

  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reset-email/`, email);
  }

  deletePasswordResetEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-reset-email/`, {token});
  }

  getPasswordResetEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-reset-email/?token=${token}`);
  }

  changePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-reset-password/`, {email, newPassword});
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login-user/`, {email, password});
  }

  loginGuest(): Observable<any> {
    return this.http.get(`${this.apiUrl}/login-guest/`);
  }
}
