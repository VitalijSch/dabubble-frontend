import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Channel } from '../../interfaces/channel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelsApiService {
  private apiUrl: string = 'http://127.0.0.1:8000/api/channels';

  private http: HttpClient = inject(HttpClient);

  createChannel(data: Channel): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-channel/`, data, { withCredentials: true });
  }

  getAllChannels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get-all-channels/`, { withCredentials: true });
  }
}
