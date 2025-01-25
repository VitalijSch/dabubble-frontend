import { Injectable } from '@angular/core';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  channels: Channel[] = [];

  channel: Channel = {
    id: 0,
    name: '',
    members: [],
    creator: 0,
    membersPk: [],
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

  getSelectedChannel(id: string): void {
    this.channel = this.channels.filter(channel => channel.id.toString() === id)[0];
  }
}
