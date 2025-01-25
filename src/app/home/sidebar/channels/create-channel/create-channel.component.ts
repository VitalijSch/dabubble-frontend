import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../../services/channel/channel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddMemberComponent } from "./add-member/add-member.component";
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [ReactiveFormsModule, AddMemberComponent],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
  host: {
    '(click)': 'channelService.toggleShowChannel()'
  },
})
export class CreateChannelComponent {
  channelForm!: FormGroup;

  channelService: ChannelService = inject(ChannelService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService: UserService = inject(UserService);

  ngOnInit(): void {
    this.initializeChannelForm();
  }

  private initializeChannelForm(): void {
    this.channelForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: '',
    })
  }

  addChannelData(): void {
    this.showAddMember();
    this.updateChannelName();
    this.updateChannelDescriptionIfNotEmpty();
    this.updateChannelCreator();
  }

  private showAddMember(): void {
    this.channelService.toggleShowAddMember();
  }

  private updateChannelName(): void {
    this.channelService.newChannel.name = this.channelForm.get('name')?.value;
  }

  private updateChannelDescriptionIfNotEmpty(): void {
    if (this.isDescriptionNotEmpty()) this.updateChannelDescription();
  }

  private isDescriptionNotEmpty(): boolean {
    return this.channelForm.get('description')?.value !== '';
  }

  private updateChannelDescription(): void {
    this.channelService.newChannel.description = this.channelForm.get('description')?.value;
  }

  private updateChannelCreator(): void {
    this.channelService.newChannel.creator = this.userService.user.id;
  }
}
