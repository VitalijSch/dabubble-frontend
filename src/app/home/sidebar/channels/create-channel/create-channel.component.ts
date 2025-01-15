import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../../services/channel/channel.service';
import { AddMemberComponent } from "./add-member/add-member.component";

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [AddMemberComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
  host: {
    '(click)': 'channelService.toggleShowChannel()'
  },
})
export class CreateChannelComponent {
  channelService: ChannelService = inject(ChannelService);
}
