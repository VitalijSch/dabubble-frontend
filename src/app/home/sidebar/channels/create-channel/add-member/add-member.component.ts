import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChannelService } from '../../../../../services/channel/channel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../../services/user/user.service';
import { User } from '../../../../../interfaces/user';
import { Channel } from '../../../../../interfaces/channel';
import { ChannelsApiService } from '../../../../../services/channels-api/channels-api.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
  host: {
    '(click)': '$event.stopPropagation()'
  },
})
export class AddMemberComponent {
  memberSelectionForm!: FormGroup;

  @ViewChild('searchInput') searchInput!: ElementRef;

  foundMembers: User[] = [];

  channelService: ChannelService = inject(ChannelService);
  userService: UserService = inject(UserService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private channelsApiService: ChannelsApiService = inject(ChannelsApiService);

  ngOnInit(): void {
    this.initializeMemberSelectionForm();
    this.resetChannelMembers();
  }

  get user(): User {
    return this.userService.user;
  }

  get users(): User[] {
    return this.userService.users;
  }

  private initializeMemberSelectionForm(): void {
    this.memberSelectionForm = this.formBuilder.group({
      selectedOption: '',
      search: '',
    });
  }

  private resetChannelMembers(): void {
    this.channelService.newChannel.members = [];
  }

  isInvalidSelection(): boolean {
    return this.isSelectionEmpty() || (this.isChooseMembersSelected() && this.isMembersInChannelEmpty());
  }

  private isSelectionEmpty(): boolean {
    return !this.memberSelectionForm.get('selectedOption')?.value
  }

  isChooseMembersSelected(): boolean {
    return this.memberSelectionForm.get('selectedOption')?.value === 'chooseMembers'
  }

  private isMembersInChannelEmpty(): boolean {
    return this.channelService.newChannel.members.length === 0;
  }

  isSearchFieldEmpty(): boolean {
    return this.memberSelectionForm.get('search')?.value === '';
  }

  selectMembers(): void {
    this.resetFoundMembers();
    if (!this.isSearchFieldEmpty()) {
      this.filterUsersBySearchTerm();
    }
  }

  private resetFoundMembers(): void {
    this.foundMembers = [];
  }

  private filterUsersBySearchTerm(): void {
    const value = this.memberSelectionForm.get('search')?.value;
    this.foundMembers = this.users.filter(user =>
      this.normalizeSearchTerm(user.username).startsWith(this.normalizeSearchTerm(value)) &&
      user.id !== this.user.id
    );
  }

  private normalizeSearchTerm(value: string): string {
    return value.trim().toLowerCase();
  }

  addMemberAndReset(member: User): void {
    this.addMember(member);
    this.addMembersIdsToMembersPk();
    this.addCurrentUserToMembersPk();
    this.resetSearchField();
    this.resetFoundMembers();
  }

  private addMember(member: User): void {
    if (this.isMemberExists(member)) return;
    this.channelService.newChannel.members?.push(member);
  }

  private isMemberExists(member: User): boolean {
    return this.channelService.newChannel.members?.some(existingMember => existingMember.id === member.id);
  }

  private addMembersIdsToMembersPk(): void {
    this.channelService.newChannel.membersPk = this.channelService.newChannel.members.map(member => member.id);
  }

  private addCurrentUserToMembersPk(): void {
    const index = this.channelService.newChannel.membersPk.findIndex(members => members === this.userService.user.id);
    if (index === -1) this.channelService.newChannel.membersPk.push(this.userService.user.id);
  }

  private resetSearchField(): void {
    this.memberSelectionForm.get('search')?.setValue('');
  }

  focusSearchField(): void {
    this.searchInput.nativeElement.focus();
  }

  isSearchInputFocused(): boolean {
    return document.activeElement === this.searchInput?.nativeElement;
  }

  deleteMemberFromChannel(member: User, event: Event): void {
    this.stopEventPropagation(event);
    this.removeMember(member);
  }

  private stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }

  private removeMember(member: User): void {
    const index = this.channelService.newChannel.members.findIndex(channelMember => channelMember.id === member.id);
    if (index === -1) return;
    this.channelService.newChannel.members.splice(index, 1);
  }

  handleCreateChannel(): void {
    this.addAllUsersToChannel();
    this.createChannel();
    this.resetNewChannel();
  }

  private addAllUsersToChannel(): void {
    if (this.isChooseMembersSelected()) return;
    this.channelService.newChannel.membersPk = this.userService.users.map(user => user.id);
  }

  private createChannel(): void {
    console.log(this.channelService.newChannel)
    this.channelsApiService.createChannel(this.channelService.newChannel).subscribe({
      next: (response) => this.handleCreateChannelSuccess(response),
      error: (error) => console.error(error),
    })
  }

  private resetNewChannel(): void {
    this.channelService.resetNewChannel();
  }

  private handleCreateChannelSuccess(response: Channel[]): void {
    this.getChannels(response);
    this.toggleShowChannel();
    this.resetChannelMembers();
  }

  private getChannels(response: Channel[]): void {
    this.channelService.channels = response;
  }

  private toggleShowChannel(): void {
    this.channelService.toggleShowChannel();
  }
}
