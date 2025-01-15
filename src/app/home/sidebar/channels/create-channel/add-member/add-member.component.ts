import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../../../services/channel/channel.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
  host: {
    '(click)': '$event.stopPropagation()'
  },
})
export class AddMemberComponent {
  channelService: ChannelService = inject(ChannelService);
}
