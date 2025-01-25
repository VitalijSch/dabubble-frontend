import { Component, inject } from '@angular/core';
import { ChannelService } from '../../services/channel/channel.service';
import { ActivatedRoute } from '@angular/router';
import { ChannelsApiService } from '../../services/channels-api/channels-api.service';
import { Channel } from '../../interfaces/channel';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  channelService: ChannelService = inject(ChannelService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private channelsApiService: ChannelsApiService = inject(ChannelsApiService);

  ngOnInit(): void {
    this.getAllChannel();
  }

  private getAllChannel(): void {
    this.channelsApiService.getAllChannels().subscribe({
      next: (response) => this.handleGetAllChannelSuccess(response),
      error: (error) => console.error(error),
    })
  }

  private handleGetAllChannelSuccess(response: Channel[]): void {
    this.saveChannelsToService(response);
    this.loadSelectedChannel();
  }

  private saveChannelsToService(channels: Channel[]): void {
    this.channelService.channels = channels;
  }

  private loadSelectedChannel(): void {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    if (!channelId) return;
    this.channelService.getSelectedChannel(channelId);
  }
}
