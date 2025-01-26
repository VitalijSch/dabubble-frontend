import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarToggleService } from '../../../services/sidebar-toggle/sidebar-toggle.service';
import { ChannelService } from '../../../services/channel/channel.service';

@Component({
  selector: 'app-channel-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-update.component.html',
  styleUrl: './channel-update.component.scss'
})
export class ChannelUpdateComponent {
  sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);
  channelService: ChannelService = inject(ChannelService);
}
