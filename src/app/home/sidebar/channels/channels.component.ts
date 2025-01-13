import { Component } from '@angular/core';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [],
  templateUrl: './channels.component.html',
  styleUrl: './channels.component.scss'
})
export class ChannelsComponent {
  closeChannels: boolean = false;

  toggleCloseChannels(): void {
    this.closeChannels = !this.closeChannels;
  }
}
