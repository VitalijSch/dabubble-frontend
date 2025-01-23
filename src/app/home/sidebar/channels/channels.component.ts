import { Component, inject } from '@angular/core';
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { ChannelService } from '../../../services/channel/channel.service';
import { ChannelsApiService } from '../../../services/channels-api/channels-api.service';

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
  private channelsApiService: ChannelsApiService = inject(ChannelsApiService);

  ngOnInit(): void {
    this.getAllChannel();
  }

  private getAllChannel(): void {
    this.channelsApiService.getAllChannels().subscribe({
      next: (response) => this.channelService.channels = response,
      error: (error) => console.error(error),
    })
  }

  toggleIsChannelHidden(): void {
    this.isChannelHidden = !this.isChannelHidden;
  }
}
