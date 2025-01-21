import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChannelService } from '../../../../../services/channel/channel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../../services/user/user.service';
import { User } from '../../../../../interfaces/user';
import { ChannelsService } from '../../../../../services/channels/channels.service';

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
  private channelsService: ChannelsService = inject(ChannelsService);

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
    this.channelService.channel.members = [];
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
    return this.channelService.channel.members.length === 0;
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

  addMemberToChannel(member: User): void {
    this.addMember(member);
    this.resetSearchField();
    this.resetFoundMembers();
  }

  private addMember(member: User): void {
    this.channelService.channel.members?.push(member);
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
    const index = this.channelService.channel.members.findIndex(channelMember => channelMember.id === member.id);
    if (index === -1) return;
    this.channelService.channel.members.splice(index, 1);
  }

  createChannel(): void {
    this.channelsService.createChannel(this.channelService.channel).subscribe({
      next: (response) => this.handleCreateChannelSuccess(response),
      error: (error) => console.error(error),
    })
  }

  private handleCreateChannelSuccess(response: any): void {
    this.toggleShowChannel();
    this.resetChannelMembers();
  }

  private toggleShowChannel(): void {
    this.channelService.toggleShowChannel();
  }
}
