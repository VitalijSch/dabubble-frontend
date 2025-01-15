import { Component, inject } from '@angular/core';
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { ChannelService } from '../../../services/channel/channel.service';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CreateChannelComponent],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss'
})
export class ChannelsComponent {
  isChannelHidden: boolean = false;

  channelService: ChannelService = inject(ChannelService);

  toggleIsChannelHidden(): void {
    this.isChannelHidden = !this.isChannelHidden;
  }
}
