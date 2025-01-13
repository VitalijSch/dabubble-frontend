import { Component } from '@angular/core';
import { ChannelsComponent } from "./channels/channels.component";
import { NewMessagesComponent } from "./new-messages/new-messages.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ChannelsComponent, NewMessagesComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
