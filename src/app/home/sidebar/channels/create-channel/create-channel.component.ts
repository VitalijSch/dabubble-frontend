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
    this.setChannelData();
    console.log(this.channelService.channel)
  }

  private showAddMember(): void {
    this.channelService.toggleShowAddMember();
  }

  private setChannelData(): void {
    this.channelService.channel.name = this.channelForm.get('name')?.value;
    if (this.channelForm.get('description')?.value !== '') {
      this.channelService.channel.description = this.channelForm.get('description')?.value;
    }
    this.channelService.channel.creator = this.userService.userData.username;
  }
}
