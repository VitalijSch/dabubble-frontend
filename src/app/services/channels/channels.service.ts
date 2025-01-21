import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {
  private APIURL: string = 'http://127.0.0.1:8000/api/channels';

  private http: HttpClient = inject(HttpClient);

  createChannel(data: Channel): Observable<any> {
    return this.http.post(`${this.APIURL}/create-channel/`, data, { withCredentials: true });
  }
}
