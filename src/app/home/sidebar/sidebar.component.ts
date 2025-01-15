import { Component } from '@angular/core';
import { ChannelsComponent } from "./channels/channels.component";
import { DirectMessagesComponent } from "./direct-messages/direct-messages.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ChannelsComponent, DirectMessagesComponent, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
