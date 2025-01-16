import { Component, inject } from '@angular/core';
import { ChannelService } from '../../../../../services/channel/channel.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  channelService: ChannelService = inject(ChannelService);

  private formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeMemberSelectionForm();
  }

  private initializeMemberSelectionForm(): void {
    this.memberSelectionForm = this.formBuilder.group({
      selectedOption: '',
    });
  }

  createChannel(): void {
    console.log('Test');
  }
}
