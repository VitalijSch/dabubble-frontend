import { Injectable } from '@angular/core';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channel: Channel = {
    name: '',
    members: [],
    creator: ''
  }

  showChannel: boolean = false;
  showAddMember: boolean = false;

  toggleShowChannel(): void {
    this.showChannel = !this.showChannel;
    this.setShowAddMemberToFalse();
  }

  private setShowAddMemberToFalse(): void {
    this.showAddMember = false;
  }

  toggleShowAddMember(): void {
    this.showAddMember = !this.showAddMember;
  }
}
