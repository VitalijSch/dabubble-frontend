import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChannelService } from '../../../../../services/channel/channel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../../services/user/user.service';
import { User } from '../../../../../interfaces/user';

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

  ngOnInit(): void {
    this.initializeMemberSelectionForm();
  }

  private initializeMemberSelectionForm(): void {
    this.memberSelectionForm = this.formBuilder.group({
      selectedOption: '',
      search: '',
    });
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
      this.removeCurrentUserFromFoundMembers();
    }
  }

  private resetFoundMembers(): void {
    this.foundMembers = [];
  }

  private filterUsersBySearchTerm(): void {
    const users = this.userService.users;
    const value = this.memberSelectionForm.get('search')?.value;
    this.foundMembers = users.filter(user => this.normalizeSearchTerm(user.username).startsWith(this.normalizeSearchTerm(value)));
  }

  private normalizeSearchTerm(value: string): string {
    return value.trim().toLowerCase();
  }

  private removeCurrentUserFromFoundMembers(): void {
    const currentUserId = this.userService.userData.id;
    const index = this.foundMembers.findIndex(member => member.id === currentUserId);
    if (index !== -1) {
      this.foundMembers.splice(index, 1);
    }
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
    if (index !== -1) {
      this.channelService.channel.members.splice(index, 1);
    }
  }

  getAvatar(user: User): string {
    return user.selected_avatar ? user.selected_avatar : `http://localhost:8000${user.uploaded_avatar!}`;
  }

  createChannel(): void {
    console.log('Test');
  }
}
