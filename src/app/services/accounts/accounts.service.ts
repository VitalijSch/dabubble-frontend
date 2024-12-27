import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/accounts';

  private http: HttpClient = inject(HttpClient);

  registerUser(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-user/`, data);
  }
}
