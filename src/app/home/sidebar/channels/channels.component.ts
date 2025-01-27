import { Component, inject } from '@angular/core';
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { ChannelService } from '../../../services/channel/channel.service';
import { ChannelsApiService } from '../../../services/channels-api/channels-api.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { Channel } from '../../../interfaces/channel';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CreateChannelComponent, RouterModule],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss'
})
export class ChannelsComponent {
  isChannelHidden: boolean = false;
  channelId: string | null = null;

  channelService: ChannelService = inject(ChannelService);
  private channelsApiService: ChannelsApiService = inject(ChannelsApiService);
  private userService: UserService = inject(UserService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.resetChannelIdIfNoChannelInUrl();
    this.getAllChannel();
    this.fetchChannelIdFromRoute();
  }

  private resetChannelIdIfNoChannelInUrl(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.router.url.includes('channel')) {
        this.channelId = null;
      }
    });
  }

  private getAllChannel(): void {
    this.channelsApiService.getAllChannels().subscribe({
      next: (response) => this.channelService.channels = response,
      error: (error) => console.error(error),
    })
  }

  private fetchChannelIdFromRoute(): void {
    this.channelId = this.route.firstChild?.snapshot.paramMap.get('channelId') ?? null;
  }

  isUserMemberInChannel(channel: Channel): boolean {
    return channel.membersPk.includes(this.userService.user.id);
  }

  toggleIsChannelHidden(): void {
    this.isChannelHidden = !this.isChannelHidden;
  }

  openChannel(id: number): void {
    this.setChannel(id);
    this.loadChannelData(id);
    this.loadMembersFromUserService();
  }

  private setChannel(id: number): void {
    this.channelId = id.toString();
  }

  private loadChannelData(id: number): void {
    this.channelService.channel = this.channelService.getSelectedChannel(id.toString());
  }

  private loadMembersFromUserService(): void {
    this.channelService.channel.members = this.userService.users.filter(user =>
      this.channelService.channel.membersPk.includes(user.id)
    );
  }
}
