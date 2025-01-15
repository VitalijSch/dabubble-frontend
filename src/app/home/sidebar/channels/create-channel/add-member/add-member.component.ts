import { Component } from '@angular/core';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss',
  host: {
    '(click)': '$event.stopPropagation()'
  },
})
export class AddMemberComponent {

}
