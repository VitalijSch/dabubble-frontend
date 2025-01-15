import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  showChannel: boolean = false;

  toggleShowChannel(): void {
    this.showChannel = !this.showChannel;
  }
}
