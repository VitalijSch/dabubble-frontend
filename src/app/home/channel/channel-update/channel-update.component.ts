import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarToggleService } from '../../../services/sidebar-toggle/sidebar-toggle.service';
import { ChannelService } from '../../../services/channel/channel.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { ChannelsApiService } from '../../../services/channels-api/channels-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-update.component.html',
  styleUrl: './channel-update.component.scss',
  host: {
    '(click)': 'channelService.toggleShowUpdateChannel()'
  },
})
export class ChannelUpdateComponent {
  name: string = '';
  description: string = '';
  showNameInputField: boolean = false;
  showDescriptionInputField: boolean = false;

  sidebarToggleService: SidebarToggleService = inject(SidebarToggleService);
  channelService: ChannelService = inject(ChannelService);
  private userService: UserService = inject(UserService);
  private channelsApiService: ChannelsApiService = inject(ChannelsApiService);
  private router: Router = inject(Router);

  getCreator(creatorId: number | User): User {
    return this.userService.users.filter(user => user.id === creatorId)[0];
  }

  toggleNameInputField(): void {
    this.showNameInputField = !this.showNameInputField;
  }

  toggleDescriptionInputField(): void {
    this.showDescriptionInputField = !this.showDescriptionInputField;
  }

  showSaveOrEditName(): string {
    if (this.showNameInputField) return 'Speichern';
    return 'Bearbeiten';
  }

  showSaveOrEditDescription(): string {
    if (this.showDescriptionInputField) return 'Speichern';
    return 'Bearbeiten';
  }

  updateChannelName(): void {
    if (this.isNameInputValid()) {
      this.setChannelName();
      this.updateChannel();
      this.resetName();
    }
    this.toggleNameInputField();
  }

  private isNameInputValid(): boolean {
    return this.showNameInputField && this.name !== '';
  }

  private setChannelName(): void {
    this.channelService.channel.name = this.name;
  }

  private resetName(): void {
    this.name = '';
  }

  updateChannelDescription(): void {
    if (this.isDescriptionInputValid()) {
      this.setChannelDescription();
      this.updateChannel();
      this.resetDescription();
    }
    this.toggleDescriptionInputField();
  }

  private isDescriptionInputValid(): boolean {
    return this.showDescriptionInputField && this.description !== '';
  }

  private setChannelDescription(): void {
    this.channelService.channel.description = this.description;
  }

  private resetDescription(): void {
    this.description = '';
  }

  leaveChannel(): void {
    this.setChannelMembersPk();
    this.updateChannel();
  }

  private setChannelMembersPk(): void {
    this.channelService.channel.membersPk = this.channelService.channel.membersPk.filter(
      memberPk => memberPk !== this.userService.user.id
    );
  }

  private updateChannel(): void {
    this.channelsApiService.updateChannel(this.channelService.channel).subscribe({
      next: () => this.handleUpdateChannelSuggess(),
      error: (error) => console.log(error),
    });
  }

  private handleUpdateChannelSuggess(): void {
    if (this.isUserLeaveChannel()) {
      this.toggleShowUpdateChannel();
      this.navigateToNewMessage();
    }
  }

  private isUserLeaveChannel(): boolean {
    return !this.channelService.channel.membersPk.includes(this.userService.user.id);
  }

  private toggleShowUpdateChannel(): void {
    this.channelService.toggleShowUpdateChannel();
  }

  private navigateToNewMessage(): void {
    this.router.navigate([`home/${this.userService.user.id}/new-message`]);
  }
}
